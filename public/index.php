<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Initialize Twig
$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader, [
    'cache' => false, // Disable in dev; you can enable caching in prod
]);

// Parse the current path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple route handling (frontend auth will protect pages via JS)
switch ($path) {
    case '/':
        echo $twig->render('landing.html.twig');
        break;

    case '/auth/login':
        echo $twig->render('auth/login.html.twig');
        break;

    case '/auth/signup':
        echo $twig->render('auth/signup.html.twig');
        break;

    case '/dashboard':
        echo $twig->render('dashboard.html.twig');
        break;

    case '/tickets':
        echo $twig->render('tickets.html.twig');
        break;

    case '/tickets/create':
        echo $twig->render('tickets/create.html.twig');
        break;

    case '/tickets/edit':
        echo $twig->render('tickets/edit.html.twig');
        break;

    default:
        http_response_code(404);
        echo $twig->render('base.html.twig', [
            'title' => '404 Not Found',
            'content' => '<h1 style="text-align:center; margin-top:50px;">404 — Page Not Found</h1>',
        ]);
        break;
}
