import http.server
import socketserver

PORT = 8000

http.server.SimpleHTTPRequestHandler.extensions_map[".js"] = "text/javascript"

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
    