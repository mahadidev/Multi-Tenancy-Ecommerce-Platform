<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Status</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5 text-center">
        <h2>Payment Status</h2>

        <?php if (session('status') == 'success'): ?>
            <div class="alert alert-success">
                <h4>Payment Successful!</h4>
                <p>Your transaction ID: <strong><?= session('transaction_id') ?></strong></p>
                <p>Thank you for your payment.</p>
            </div>
        <?php elseif (session('status') == 'failed'): ?>
            <div class="alert alert-danger">
                <h4>Payment Failed!</h4>
                <p>Reason: <?= session('message') ?? 'Transaction could not be completed.' ?></p>
                <p>Please try again.</p>
            </div>
        <?php else: ?>
            <div class="alert alert-warning">
                <h4>No Payment Information Found!</h4>
                <p>It looks like there's no payment status available.</p>
            </div>
        <?php endif; ?>

        <a href="<?= route('uddoktapay.pay') ?>" class="btn btn-primary mt-3">Try Again</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
