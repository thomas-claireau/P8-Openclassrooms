(function(window) {
	'use strict';

	/**
	 * Création d'une nouvelle instance de Model et intéraction avec la classe {@link Store}
	 *
	 * @constructor
	 * @param {object} storage Identifie la classe {@link Store} côté client.
	 */
	class Model {
		constructor(storage) {
			this.storage = storage;
		}

		/**
		 * Créer un nouveau model pour la tâche ajoutée
		 *
		 * @param {string} title Le titre la tâche
		 * @param {function} callback La fonction appelé après que le model soit crée.
		 */
		create(title, callback) {
			title = title || '';
			callback = callback || function() {};
			var newItem = {
				title: title.trim(),
				completed: false,
			};
			this.storage.save(newItem, callback);
		}

		/**
		 * Recherche et retourne un modèle stocké. Si aucune requête n'est donnée, tout sera simplement retourné. Si vous transmettez une chaîne ou un nombre, il le recherchera en tant qu'ID du modèle à rechercher. Enfin, vous pouvez lui transmettre un objet à comparer.
		 * Recherche et retourne dans le localStorage un model stocké.
		 * Si aucune requête n'est envoyée, tous les models seront renvoyés.
		 * Si la requête est une chaine de caractère ou un nombre, la méthode recherchera un id de model à retourner
		 * Il est aussi possible de passer un objet à comparer dans la requête.
		 *
		 * @param {string|number|object} query La requête pour filtrer les modèles
		 * @param {function} callback Une fonction de rappel à utiliser lorsqu'un model est trouvé
		 *
		 * @example
		 * model.read(1, func); // Va chercher et trouver le modèle avec l'id 1
		 * model.read('1'); // Fera la même chose
		 * // Ci-dessous, un exemple avec foo égal à bar et hello égal à world
		 * model.read({ foo: 'bar', hello: 'world' });
		 */
		read(query, callback) {
			var queryType = typeof query;
			callback = callback || function() {};
			if (queryType === 'function') {
				callback = query;
				return this.storage.findAll(callback);
			} else if (queryType === 'string' || queryType === 'number') {
				query = parseInt(query, 10);
				this.storage.find({ id: query }, callback);
			} else {
				this.storage.find(query, callback);
			}
		}

		/**
		 * Met à jour un modèle en lui attribuant un ID, des données à mettre à jour et une fonction de rappel appelée une fois la mise à jour terminée.
		 *
		 * @param {number} id L'id du model à mettre à jour
		 * @param {object} data Les données à mettre à jour et leurs nouvelles valeurs
		 * @param {function} callback La fonction de rappel utilisée après la mise à jour
		 */
		update(id, data, callback) {
			this.storage.save(data, callback, id);
		}

		/**
		 * Supprime un élément du stockage
		 *
		 * @param {number} id L'id du model à supprimer
		 * @param {function} callback La fonction de rappel utilisée après la suppression
		 */
		remove(id, callback) {
			this.storage.remove(id, callback);
		}

		/**
		 * Attention, cette méthode supprime tous les éléments du stockage
		 *
		 * @param {function} callback La fonction de rappel utilisée après la suppression
		 */
		removeAll(callback) {
			this.storage.drop(callback);
		}

		/**
		 * Retourne le nombre de todos
		 */
		getCount(callback) {
			var todos = {
				active: 0,
				completed: 0,
				total: 0,
			};
			this.storage.findAll(function(data) {
				data.forEach(function(todo) {
					if (todo.completed) {
						todos.completed++;
					} else {
						todos.active++;
					}
					todos.total++;
				});
				callback(todos);
			});
		}
	}

	// Exporte vers l'objet Window (affichage)
	window.app = window.app || {};
	window.app.Model = Model;
})(window);
