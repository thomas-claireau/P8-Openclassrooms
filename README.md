# P8-Openclassrooms - Reprenez et améliorez un projet existant

## Brief du projet

Dans le monde professionnel, on est souvent amené à reprendre un projet existant. Que faire quand vous vous retrouvez avec le code de quelqu'un d'autre ? Comment l'améliorer ? Voilà un savoir-faire qui vous sera très utile au quotidien !

En effet, faire un projet de bout en bout est "facile" : on connaît son fonctionnement sur le bout des doigts. En revanche, on se rend vite compte qu'il est plus dur de reprendre le travail de quelqu'un d'autre... surtout quand il n'a pas de tests !

Vous venez d'intégrer une petite équipe qui pense que tous les problèmes du monde viennent du fait que les gens ne sont pas assez organisés et qu'un peu de focus pourrait tout changer ! C'est pourquoi ils ont créé ce qu'ils appellent la meilleur application "to-do list" du monde. L'idée elle-même est très bien mais le code derrière n'est pas au top ! Ils vous ont sollicité pour ajouter des tests et régler quelques bugs dans le code.

Le code initial du projet à améliorer est [disponible ici](https://s3-eu-west-1.amazonaws.com/static.oc-static.com/prod/courses/files/project-8-frontend/todo-list-project.zip)

Regardez comment il est structuré et essayez de comprendre comment il fonctionne. Votre mission sera de corriger des bugs, ajouter des tests, et optimiser sa performance.

![apercu projet](https://user.oc-static.com/upload/2017/10/19/15083988221397_Screen%20Shot%202017-10-17%20at%2010.52.21%20AM.png)

### Etape 1 : Corrigez les bugs

Il y a deux bugs dans le code et c'est votre mission de les trouver ! Voici quelques indices:

* Le premier est une faute de frappe.
* Le deuxième introduit un conflit éventuel entre deux IDs identiques.

Vous allez chercher ces bugs dans le code, un peu comme dans "Où est Charlie". Une fois les bugs trouvés, corrigez-les ! Ils empêchent le code de marcher correctement (pour l'instant ce n'est même pas possible d'ajouter des tâches à la liste à cause de ces bugs).

Il y a également des améliorations à faire, même s'il ne s'agit pas de bugs proprement dit. Essayez de trouver où vous pouvez optimiser des boucles et vérifiez s'il y a des fonctions qui affichent des informations dans la console de déboggage  qui ne sont pas nécessaires.

### Etape 2 : où sont les tests ?!

Vous allez voir que ce projet a déjà quelques tests mais largement pas assez ! Pour le prendre en main, vous allez ajouter tous les tests unitaires et fonctionnels  pertinents que vous pouvez. L'objectif est de solidifier le projet. Ainsi, lorsque vous le modifierez par la suite, vous pourrez vous baser sur ces tests pour vérifier que vous ne "cassez" rien.

Cette étape peut paraître un peu longue et fastidieuse, mais elle est nécessaire pour gagner beaucoup de temps et éviter des surprises à l'avenir !

### Etape 3 : optimisez la performance

Votre équipe vous a demandé d'analyser la performance d'un site concurrent pour identifier ce qui marche bien et ce qui ne marche pas, au cas où vous décidez de "scaler" votre propre application. Voici le site du concurrent.

Utilisez la console de développement de votre navigateur pour analyser la performance du site. Faites attention aux ressources utilisées par les différents éléments du site (par exemple, ce qui est lent, ce qui est rapide, etc) et aux ressources utilisées par les publicités sur le site et celles utilisées pour effectuer les fonctionnalités "To-do" pour la liste elle-même.

Maintenant, vous allez faire un audit de performance. En vous appuyant sur les données, écrivez un document de 300 à 500 mots qui décrit la performance du site, comment il se distingue de votre application, et comment optimiser la performance en vue d'un éventuel "scaling" de votre application.

### Etape 4 : améliorez le projet

Maintenant que vous connaissez ce code par cœur, vous pouvez facilement ajouter des informations supplémentaires à votre documentation. Vous êtes désormais prêt à écrire de la documentation technique ! Jetez un œil [aux exemples suivants](https://www.atlassian.com/blog/add-ons/5-real-life-examples-beautiful-technical-documentation) pour vous inspirer.

Pour le dire plus simplement, il faut documenter les éléments suivants :

* le projet lui-même (l'usage non technique)
* comment il fonctionne techniquement
* votre audit

Vous pouvez utiliser le format que vous souhaitez (ex. un wiki sur Github, un document en format texte, etc).

### ✔️ Projet validé

Commentaires de l'évaluateur :

1. Provide an assessment of the student's work and, if the project has to be reworked, write a few lines about the criteria the project does not currently meet:

Thomas a réalisé un très bon audit, ainsi qu'un bon travail d'optimisation du projet et la correction des bugs s'est très bien déroulée.

2. Assessment of the project deliverables against the project criteria:

Les tests unitaires manquants ont étés ajoutés
Thomas a d'ailleurs écrit d'avantage de tests
Les tests sont pertinents et correspondent à la description associée
Au moins un outil d'analyse a été utilisé
Thomas en a utilisé au moins trois différents et a réalisé des comparaisons avec et sans pub.
L'audit est pertinent et met en avant les forces et faiblesse de chaque site
Des solutions pour améliorer la performance ont étés apportées
Thomas est capable d'expliquer comment fonctionne le code de l'application
Les deux bugs de la première étape ont été corrigés
3. Assessment of the student’s delivery of the presentation and whether they meet the presentation guidelines:

La présentation de Thomas était excellente, son écran était séparé en deux parties, le code et le powerpoint pour pouvoir suivre plus facilement les différente partie de la présentation.
Le Q&A s'est très bien déroulé.

4. Assessment of the student's newly acquired skills:

Thomas est capable de : 

Mettre en oeuvre des tests unitaires et fonctionnels dans une application web
Optimiser les performances d'un projet à l'aide des DevTools
Reprendre en main un projet JavaScript existant
5. Explain at least one core strength of the work the student has done so far:

Les tests sont cohérents et Thomas a beaucoup travaille a optimiser l'app.

6. Explain at least one area in which the student’s work needs to improve:

Un soucis de driver linux pose problème au partage d’écran via navigateurs, rien de bien grave, cependant.


### 🎬 Cliquez sur l'image ci-dessous pour voir la vidéo de soutenance 👇

[![Regarder la vidéo de soutenance](https://img.youtube.com/vi/-4cNaeZQrzk/maxresdefault.jpg)](https://youtu.be/-4cNaeZQrzk)
