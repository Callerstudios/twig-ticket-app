<?php
require_once __DIR__ . '/../vendor/autoload.php';
session_start();

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Protected pages
$protectedRoutes = ['/dashboard', '/tickets', '/tickets/create', '/tickets/edit'];

if (in_array($path, $protectedRoutes) && empty($_SESSION['ticketapp_session'])) {
    header('Location: /auth/login');
    exit;
}

switch ($path) {
    case '/':
        echo $twig->render('landing.html.twig');
        break;

    case '/auth/login':
        require_once __DIR__ . '/../api/AuthController.php';
        (new AuthController($twig))->login();
        break;

    case '/auth/signup':
        require_once __DIR__ . '/../api/AuthController.php';
        (new AuthController($twig))->signup();
        break;

    case '/dashboard':
        require_once __DIR__ . '/../api/DashboardController.php';
        (new DashboardController($twig))->index();
        break;

    case '/tickets':
        require_once __DIR__ . '/../api/TicketController.php';
        (new TicketController($twig))->list();
        break;

    case '/tickets/create':
        require_once __DIR__ . '/../api/TicketController.php';
        (new TicketController($twig))->create();
        break;

    case '/tickets/edit':
        require_once __DIR__ . '/../api/TicketController.php';
        (new TicketController($twig))->edit();
        break;

    case '/logout':
        session_destroy();
        header('Location: /');
        break;

    default:
        http_response_code(404);
        echo $twig->render('base.html.twig', ['content' => '<h1>404 Not Found</h1>']);
}
