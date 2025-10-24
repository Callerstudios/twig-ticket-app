<?php
class TicketController {
    private $twig;
    private $file;

    public function __construct($twig) {
        $this->twig = $twig;
        $this->file = __DIR__ . '/../data/tickets.json';
    }

    private function loadTickets() {
        return json_decode(file_get_contents($this->file), true) ?? [];
    }

    private function saveTickets($tickets) {
        file_put_contents($this->file, json_encode($tickets, JSON_PRETTY_PRINT));
    }

    public function list() {
        $tickets = $this->loadTickets();
        echo $this->twig->render('tickets/list.html.twig', ['tickets' => $tickets]);
    }

    public function create() {
        $error = null;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $title = trim($_POST['title']);
            $status = trim($_POST['status']);
            $description = trim($_POST['description']);

            if (!$title || !in_array($status, ['open', 'in_progress', 'closed'])) {
                $error = 'Invalid title or status.';
            } else {
                $tickets = $this->loadTickets();
                $tickets[] = [
                    'id' => uniqid(),
                    'title' => $title,
                    'status' => $status,
                    'description' => $description,
                    'created_at' => date('Y-m-d H:i:s')
                ];
                $this->saveTickets($tickets);
                header('Location: /tickets');
                exit;
            }
        }

        echo $this->twig->render('tickets/form.html.twig', [
            'error' => $error,
            'action' => 'create'
        ]);
    }

    public function edit() {
        $tickets = $this->loadTickets();
        $id = $_GET['id'] ?? null;
        $ticket = null;

        foreach ($tickets as &$t) {
            if ($t['id'] === $id) {
                $ticket = &$t;
                break;
            }
        }

        if (!$ticket) {
            http_response_code(404);
            echo "Ticket not found.";
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $ticket['title'] = trim($_POST['title']);
            $ticket['status'] = trim($_POST['status']);
            $ticket['description'] = trim($_POST['description']);
            $this->saveTickets($tickets);
            header('Location: /tickets');
            exit;
        }

        echo $this->twig->render('tickets/form.html.twig', [
            'ticket' => $ticket,
            'action' => 'edit'
        ]);
    }
}
