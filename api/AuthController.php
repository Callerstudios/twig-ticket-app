<?php
class AuthController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function login() {
        $error = null;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);

            if ($email === 'user@example.com' && $password === '123456') {
                $_SESSION['ticketapp_session'] = bin2hex(random_bytes(16));
                header('Location: /dashboard');
                exit;
            } else {
                $error = 'Invalid credentials. Try user@example.com / 123456';
            }
        }

        echo $this->twig->render('auth/login.html.twig', ['error' => $error]);
    }

    public function signup() {
        $error = null;
        $success = null;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);

            if (!$email || !$password) {
                $error = 'All fields are required.';
            } else {
                $success = 'Account created! You can now log in.';
            }
        }

        echo $this->twig->render('auth/signup.html.twig', [
            'error' => $error,
            'success' => $success
        ]);
    }
}
