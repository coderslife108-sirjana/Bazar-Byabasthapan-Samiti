# Dumkibas Bazar Byabasthapan Samiti

## Run on a laptop and mobile device

1. Start the API from the `server` directory with `npm run dev` (or `npm start`).
2. Start the client from this directory with `npm run dev -- --host 0.0.0.0`.
3. Connect the phone and laptop to the same Wi-Fi network, then open the Vite
   network address shown in the terminal on the phone. To find the laptop's
   local IPv4 address on Windows, run `ipconfig` and use
   `http://<IPv4-address>:5173`.
4. If Windows Firewall prompts you, allow Node.js on the private network.

The client proxies `/api` requests to the API on the laptop, so the phone does
not try to connect to its own `localhost`. Keep both servers running while
testing. For a deployed build, set `VITE_API_BASE_URL` to the public API URL
including `/api` before building.

## Client commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs Oxlint.
