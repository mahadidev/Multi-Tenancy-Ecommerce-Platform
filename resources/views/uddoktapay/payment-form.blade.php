<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UddoktaPay Payment</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h2>UddoktaPay Payment</h2>

        <!-- Display Validation Errors -->
        <?php if ($errors->any()): ?>
            <div class="alert alert-danger">
                <ul>
                    <?php foreach ($errors->all() as $error): ?>
                        <li><?= $error ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <!-- Payment Form -->
        <form action="<?= route('uddoktapay.pay') ?>" method="POST">
            <?= csrf_field() ?>
            <div class="form-group">
                <label for="name">Full Name:</label>
                <input type="text" name="name" id="name" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="amount">Amount (TK):</label>
                <input type="number" name="amount" id="amount" class="form-control" required min="1">
            </div>
            <button type="submit" class="btn btn-primary mt-3">Pay Now</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
