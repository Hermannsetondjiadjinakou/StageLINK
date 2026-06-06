<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px;">

    <h2>Bonjour {{ $application->student->name }},</h2>

    <p>Le statut de votre candidature pour l'offre <strong>{{ $application->offer->title }}</strong>
    chez <strong>{{ $application->offer->company->company_name }}</strong> a été mis à jour.</p>

    <p>Nouveau statut :
        @if($application->status === 'interview')
            <strong style="color: #f59e0b;">Entretien</strong> — L'entreprise souhaite vous rencontrer.
        @elseif($application->status === 'accepted')
            <strong style="color: #10b981;">Accepté</strong> — Félicitations !
        @elseif($application->status === 'rejected')
            <strong style="color: #ef4444;">Refusé</strong> — Ne vous découragez pas, continuez vos recherches.
        @else
            <strong>En attente</strong>
        @endif
    </p>

    @if($application->internal_note)
    <p>Message de l'entreprise : <em>{{ $application->internal_note }}</em></p>
    @endif

    <hr>
    <p style="font-size: 12px; color: #999;">StageLink — Plateforme de mise en relation stages</p>

</body>
</html>