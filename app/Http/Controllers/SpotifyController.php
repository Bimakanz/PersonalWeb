<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SpotifyController extends Controller
{
    private function clientId()     { return env('SPOTIFY_CLIENT_ID'); }
    private function clientSecret() { return env('SPOTIFY_CLIENT_SECRET'); }
    private function redirectUri()  { return env('SPOTIFY_REDIRECT_URI'); }
    private function refreshToken() { return env('SPOTIFY_REFRESH_TOKEN'); }

    /** Step 1: Redirect to Spotify login page */
    public function auth()
    {
        $query = http_build_query([
            'client_id'     => $this->clientId(),
            'response_type' => 'code',
            'redirect_uri'  => $this->redirectUri(),
            'scope'         => 'user-read-currently-playing user-read-recently-played',
        ]);

        return redirect("https://accounts.spotify.com/authorize?{$query}");
    }

    /** Step 2a: Spotify redirects here (production server flow) */
    public function callback(Request $request)
    {
        if (!$request->has('code')) {
            return response('<h2 style="font-family:sans-serif;padding:40px;color:red">❌ No code provided.</h2>');
        }
        return $this->doExchange($request->code);
    }

    /**
     * Step 2b: Manual exchange page (local dev flow)
     * — After Spotify redirects to prod URL (which may 404),
     *   copy the "code=XXXX" from the URL and paste it here.
     */
    public function exchangeForm(Request $request)
    {
        if ($request->has('code')) {
            return $this->doExchange($request->code);
        }

        return response('
            <html><body style="font-family:sans-serif;padding:40px;background:#111;color:#0f0">
            <h2>&#127925; Spotify Code Exchange</h2>
            <p>1. Buka <a href="/spotify/auth" style="color:#0f0">http://localhost:8000/spotify/auth</a></p>
            <p>2. Login & Allow di Spotify</p>
            <p>3. Browser redirect ke sxnaspace... dan mungkin error — <b>itu normal!</b></p>
            <p>4. Dari URL-nya, copy nilai setelah <code>?code=</code> (sebelum tanda &amp;)</p>
            <p>5. Paste di bawah ini:</p>
            <form method="GET" action="/spotify/exchange">
                <input name="code" placeholder="Paste kode Spotify di sini..."
                    style="width:500px;padding:10px;background:#222;color:#0f0;border:1px solid #0f0;font-size:14px;display:block;margin-bottom:10px" />
                <button type="submit"
                    style="padding:10px 20px;background:#0f0;color:#000;font-weight:bold;font-size:14px">
                    Exchange &rarr;
                </button>
            </form>
            </body></html>
        ');
    }

    /** Core: Exchange auth code for tokens and save refresh token to .env */
    private function doExchange(string $code)
    {
        $response = Http::withBasicAuth($this->clientId(), $this->clientSecret())
            ->asForm()
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type'   => 'authorization_code',
                'code'         => $code,
                'redirect_uri' => $this->redirectUri(),
            ]);

        if (!$response->successful()) {
            $error = $response->json('error_description') ?? 'Unknown error';
            return response('<h2 style="font-family:sans-serif;padding:40px;color:red">❌ Failed: ' . $error . '</h2>');
        }

        $refreshToken = $response->json('refresh_token');

        // Save refresh token to .env
        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        if (str_contains($envContent, 'SPOTIFY_REFRESH_TOKEN=')) {
            $envContent = preg_replace('/SPOTIFY_REFRESH_TOKEN=.*/', "SPOTIFY_REFRESH_TOKEN={$refreshToken}", $envContent);
        } else {
            $envContent .= "\nSPOTIFY_REFRESH_TOKEN={$refreshToken}";
        }

        file_put_contents($envPath, $envContent);
        \Artisan::call('config:clear');

        return response('<div style="font-family:sans-serif;padding:40px;background:#111;color:#00ff00;min-height:100vh">
            <h2>&#9989; Spotify Connected!</h2>
            <p>Refresh token berhasil disimpan. Kamu bisa tutup tab ini.</p>
            <p style="color:#888;font-size:12px">Token (partial): ' . substr($refreshToken, 0, 30) . '...</p>
        </div>');
    }

    /** Get fresh access token using saved refresh token */
    private function getAccessToken(): ?string
    {
        $refreshToken = $this->refreshToken();
        if (!$refreshToken) return null;

        $response = Http::withBasicAuth($this->clientId(), $this->clientSecret())
            ->asForm()
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
            ]);

        if (!$response->successful()) return null;

        return $response->json('access_token');
    }

    /** API endpoint polled by the frontend every 30 seconds */
    public function nowPlaying()
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return response()->json(['status' => 'not_configured']);
        }

        // Try currently playing
        $current = Http::withToken($accessToken)
            ->get('https://api.spotify.com/v1/me/player/currently-playing');

        if ($current->status() === 200) {
            $body = $current->json();
            if (!empty($body['is_playing']) && isset($body['item'])) {
                $item = $body['item'];
                return response()->json([
                    'status'   => 'playing',
                    'track'    => $item['name'],
                    'artist'   => collect($item['artists'])->pluck('name')->join(', '),
                    'album'    => $item['album']['name'],
                    'cover'    => $item['album']['images'][1]['url'] ?? $item['album']['images'][0]['url'] ?? null,
                    'url'      => $item['external_urls']['spotify'] ?? null,
                    'progress' => $body['progress_ms'],
                    'duration' => $item['duration_ms'],
                ]);
            }
        }

        // Fallback: recently played
        $recent = Http::withToken($accessToken)
            ->get('https://api.spotify.com/v1/me/player/recently-played', ['limit' => 5]);

        if ($recent->successful()) {
            $tracks = collect($recent->json('items'))->map(fn($item) => [
                'track'  => $item['track']['name'],
                'artist' => collect($item['track']['artists'])->pluck('name')->join(', '),
                'album'  => $item['track']['album']['name'],
                'cover'  => $item['track']['album']['images'][1]['url'] ?? $item['track']['album']['images'][0]['url'] ?? null,
                'url'    => $item['track']['external_urls']['spotify'] ?? null,
            ]);

            return response()->json(['status' => 'recent', 'tracks' => $tracks]);
        }

        return response()->json(['status' => 'offline']);
    }
}
