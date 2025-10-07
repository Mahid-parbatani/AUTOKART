import socket
import ssl

host = '127.0.0.1'
port = 12345

context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

with socket.create_connection((host, port)) as sock:
    with context.wrap_socket(sock, server_hostname=host) as ssock:
        print("Connected securely to server")

        ssock.send("Hello Secure Server, this is Mahid’s Client!".encode())
        data = ssock.recv(1024).decode()
        print("Server:", data)
