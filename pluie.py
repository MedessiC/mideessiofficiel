import random
import time
import os

# Dimensions de la "fenêtre"
WIDTH = 40
HEIGHT = 20

# Liste des gouttes
raindrops = []

while True:
    # Ajoute une nouvelle goutte en haut
    if random.random() < 0.3:  # probabilité d'apparition
        raindrops.append([random.randint(0, WIDTH - 1), 0])

    # Déplace les gouttes vers le bas
    for drop in raindrops:
        drop[1] += 1

    # Supprime celles qui sortent de l'écran
    raindrops = [d for d in raindrops if d[1] < HEIGHT]

    # Efface l'écran
    os.system("cls" if os.name == "nt" else "clear")

    # Affiche la scène
    for y in range(HEIGHT):
        line = ""
        for x in range(WIDTH):
            if [x, y] in raindrops:
                line += "|"
            else:
                line += " "
        print(line)

    time.sleep(0.1)
