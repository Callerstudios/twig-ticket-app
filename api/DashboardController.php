<?php
class DashboardController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        $tickets = json_decode(file_get_contents(__DIR__ . '/../data/tickets.json'), true) ?? [];

        $total = count($tickets);
        $open = count(array_filter($tickets, fn($t) => $t['status'] === 'open'));
        $resolved = count(array_filter($tickets, fn($t) => $t['status'] === 'closed'));

        echo $this->twig->render('dashboard.html.twig', [
            'total' => $total,
            'open' => $open,
            'resolved' => $resolved
        ]);
    }
}
