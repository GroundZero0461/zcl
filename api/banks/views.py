from rest_framework import views, status, parsers
from django import http
from django.core.files.uploadedfile import InMemoryUploadedFile
from .parsing import PlayerBank
from api.models import Leaderboard
from api import utils
from django.db import transaction
import logging
import io

log = logging.getLogger('zcl.api.banks')

class BankAPIView(views.APIView):
    parser_classes = (parsers.FileUploadParser,)

    @transaction.atomic()
    def _update(self, pb: PlayerBank):
        profile_cache = {}
        profile = utils.fetch_or_create_profile(pb.id, profile_cache)
        for mode in pb.modes:
            print(f'updating self for mode {mode}')
            obj = pb.modes[mode]
            Leaderboard.objects.get_or_create(
                profile=profile,
                mode=mode,
                defaults={
                    'wins': int(obj.get('wins', 0)),
                    'games': int(obj.get('games', 0)),
                    'losses': int(obj.get('losses', 0)),
                    'elo': float(obj.get('elo', 0)),
                }
            )
        # Update records where the 'time' field is greater than last update.
        mode = pb.last_game.get('mode')
        if mode is None:
            return
        time = int(pb.last_game.get('time'), 0)
        players = pb.last_game.get('players', {})
        for id, stats in players.items():
            profile = utils.fetch_or_create_profile(id, profile_cache)
            print(f'getting ready to update {mode} for {profile.name}')
            wins = int(stats.get('wins', 0))
            games = int(stats.get('games', 0))
            losses = int(stats.get('losses', 0))
            elo = float(stats.get('elo', 0))
            lb, created = Leaderboard.objects.get_or_create(
                profile=profile,
                mode=mode,
                defaults={
                    'wins': wins,
                    'games': games,
                    'losses': losses,
                    'elo': elo
                }
            )
            if created:
                continue
            # updated_iso = lb.updated.timestamp()
            # Can't use time. Epoch is not UTC based.
            if lb.games > games:
                continue

            lb.wins = wins
            lb.losses = losses
            lb.games = games
            lb.elo = elo
            lb.save()



    def post(self, request: http.HttpRequest):
        """
        Upload the bank file
        Parameters
        ----------
        request

        Returns
        -------

        """
        # TODO: Implement sign checking
        try:

            bank: InMemoryUploadedFile = request.FILES['file']
            data = io.BytesIO(bank.read())
            pb = PlayerBank(data)
            self._update(pb)
            return http.HttpResponse(status=status.HTTP_200_OK)
        except Exception as e:
            log.error(e)
            return http.HttpResponse(status=status.HTTP_200_OK)



