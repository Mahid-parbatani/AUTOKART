import socket
import ssl

host = '127.0.0.1'
port = 12345

context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain(certfile="server.crt", keyfile="server.key")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0) as sock:
    sock.bind((host, port))
    sock.listen(5)
    print("Server started... waiting for connection")

    with context.wrap_socket(sock, server_side=True) as ssock:
        conn, addr = ssock.accept()
        print("Connection established with:", addr)

        data = conn.recv(1024).decode()
        print("Client:", data)

        conn.send("Hello, this is Mahid’s Secure Server!".encode())
        conn.close()
