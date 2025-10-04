package main

import (
  "net/http"
)

func main() {
  http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
    if r.Method == "OPTIONS" {
      w.WriteHeader(http.StatusOK)
      return
    }
    w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
    w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
    switch r.URL.Path {
    case "/": http.ServeFile(w, r, "./index.html")
    case "/js/fbm.mjs":
      w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
      http.ServeFile(w, r, "./js/fbm.mjs")
    case "/js/fbm-worker.js":
      w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
      http.ServeFile(w, r, "./js/fbm-worker.js")
    case "/wasm/noise.wasm":
      w.Header().Set("Content-Type", "application/wasm")
      http.ServeFile(w, r, "./wasm/noise.wasm")
    }
  });
  http.ListenAndServe(":8000", nil)
}
