(function(window) {
	'use strict';

	/**
	 * Permet l'intéraction entre le {@link Model} et la {@link View}
	 *
	 * @constructor
	 * @param {object} model L'instance du {@link Model}
	 * @param {object} view L'instance de la {@link View}
	 */
	class Controller {
		constructor(model, view) {
			var self = this;
			self.model = model;
			self.view = view;
			self.view.bind('newTodo', function(title) {
				self.addItem(title);
			});
			self.view.bind('itemEdit', function(item) {
				self.editItem(item.id);
			});
			self.view.bind('itemEditDone', function(item) {
				self.editItemSave(item.id, item.title);
			});
			self.view.bind('itemEditCancel', function(item) {
				self.editItemCancel(item.id);
			});
			self.view.bind('itemRemove', function(item) {
				self.removeItem(item.id);
			});
			self.view.bind('itemToggle', function(item) {
				self.toggleComplete(item.id, item.completed);
			});
			self.view.bind('removeCompleted', function() {
				self.removeCompletedItems();
			});
			self.view.bind('toggleAll', function(status) {
				self.toggleAll(status.completed);
			});
		}
		/**
		 * Charge et initialise la {@link View}
		 *
		 * @param {string} locationHash Peut prendre 3 valeurs : '' / 'active' / 'completed'
		 */
		setView(locationHash) {
			var route = locationHash.split('/')[1];
			var page = route || '';
			this._updateFilterState(page);
		}

		/**
		 * Affiche toutes les tâches de la liste en cours
		 */
		showAll() {
			var self = this;
			self.model.read(function(data) {
				self.view.render('showEntries', data);
			});
		}

		/**
		 * Affiche toutes les tâches actives de la liste en cours
		 */
		showActive() {
			var self = this;
			self.model.read({ completed: false }, function(data) {
				self.view.render('showEntries', data);
			});
		}

		/**
		 * Affiche toutes les tâches complétées de la liste en cours
		 */
		showCompleted() {
			var self = this;
			self.model.read({ completed: true }, function(data) {
				self.view.render('showEntries', data);
			});
		}

		/**
		 * Ajoute une nouvelle tâche dans la liste en cours (insertion dans le DOM et dans le local storage)
		 * @param {string} title Le titre de la tâche ajoutée
		 */
		addItem(title) {
			var self = this;
			// amélioration
			if (title.trim() !== '') {
				self.model.create(title, function() {
					self.view.render('clearNewTodo');
					self._filter(true);
				});
			}
			// if (title.trim() === '') {
			// 	return;
			// }
			// self.model.create(title, function() {
			// 	self.view.render('clearNewTodo');
			// 	self._filter(true);
			// });
		}

		/**
		 * Active l'édition d'une tâche de la liste en cours
		 * @param {number} id L'id du model (correspondant à la tâche à éditer)
		 */
		editItem(id) {
			var self = this;
			self.model.read(id, function(data) {
				self.view.render('editItem', { id: id, title: data[0].title });
			});
		}

		/**
		 * Enregistre la nouvelle tâche éditée
		 * @param {number} id L'id de la tâche éditée
		 * @param {string} title Le titre de la tâche éditée
		 */
		editItemSave(id, title) {
			var self = this;
			// amélioration
			// while (title[0] === ' ') {
			// 	title = title.slice(1);
			// }
			// while (title[title.length - 1] === ' ') {
			// 	title = title.slice(0, -1);
			// }
			if (title.length !== 0) {
				title = title.trim();
				self.model.update(id, { title: title }, function() {
					self.view.render('editItemDone', { id: id, title: title });
				});
			} else {
				self.removeItem(id);
			}
		}

		/**
		 * Annule l'édition de la tâche en cours
		 * @param id L'id de la tâche éditée
		 */
		editItemCancel(id) {
			var self = this;
			self.model.read(id, function(data) {
				self.view.render('editItemDone', { id: id, title: data[0].title });
			});
		}

		/**
		 * Supprime une tâche de la liste en cours.
		 *
		 * @param {number} id L'id de la tâche à supprimer dans le DOM et dans le localStorage
		 */
		removeItem(id) {
			var self = this;
			var items;
			self.model.read(function(data) {
				items = data;
			});
			// amélioration
			// items.forEach(function(item) {
			// 	if (item.id === id) {
			// 		console.log('Element with ID: ' + id + ' has been removed.');
			// 	}
			// });
			// self.model.remove(id, function() {
			// 	self.view.render('removeItem', id);
			// });
			self.model.remove(id, function() {
				self.view.render('removeItem', id);
				console.log('Element with ID: ' + id + ' has been removed.');
			});
			self._filter();
		}

		/**
		 * Supprime toutes les tâches terminées de la liste en cours
		 */
		removeCompletedItems() {
			var self = this;
			self.model.read({ completed: true }, function(data) {
				data.forEach(function(item) {
					self.removeItem(item.id);
				});
			});
			self._filter();
		}

		/**
		 * Actualise l'affichage de la tâche en fonction de son statut (terminé ou non)
		 *
		 * @param {number} id L'id de la tâche (toutes les tâches sont parcourues)
		 * @param {boolean} checkbox Vérifie si le champ checked est coché ou non
		 * @param {boolean|undefined} silent Empêche le refiltrage des éléments de la liste
		 */
		toggleComplete(id, completed, silent) {
			var self = this;
			self.model.update(id, { completed: completed }, function() {
				self.view.render('elementComplete', {
					id: id,
					completed: completed,
				});
			});
			if (!silent) {
				self._filter();
			}
		}

		/**
		 * Permet d'activer ou de désactiver les cases cochées
		 * @param {object} completed Les tâches terminées
		 */
		toggleAll(completed) {
			console.log(completed);
			var self = this;
			self.model.read({ completed: !completed }, function(data) {
				data.forEach(function(item) {
					self.toggleComplete(item.id, completed, true);
				});
			});
			self._filter();
		}

		/**
		 * Met à jour le compteur de tâche en bas à gauche de l'application
		 */
		_updateCount() {
			var self = this;
			self.model.getCount(function(todos) {
				self.view.render('updateElementCount', todos.active);
				self.view.render('clearCompletedButton', {
					completed: todos.completed,
					visible: todos.completed > 0,
				});
				self.view.render('toggleAll', { checked: todos.completed === todos.total });
				self.view.render('contentBlockVisibility', { visible: todos.total > 0 });
			});
		}

		/**
		 * Refiltre les tâches en fonction de leur statut actif (#active)
		 * @param {boolean|undefined} force  Refiltre les tâches.
		 */
		_filter(force) {
			var activeRoute =
				this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

			// Update the elements on the page, which change with each completed todo
			// Actualise le nombre d'élément sur la page à chaque fois qu'une tâche est terminée
			this._updateCount();

			// Si le filtre n'est pas "All" ou si nous avons changé le filtre, nous devons re-créer les tâches en appelant:
			//   this.show[All|Active|Completed]();
			if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
				this['show' + activeRoute]();
			}
			this._lastActiveRoute = activeRoute;
		}

		/**
		 * Met à jour l'url pour filtrer les tâches (ajoute à l'url : /active ou /completed)
		 */
		_updateFilterState(currentPage) {
			// Stocke une référence à la route active, nous permettant de filtrer à nouveau les tâches à faire lorsqu'elles sont marquées comme terminée ou non terminée.
			this._activeRoute = currentPage;
			if (currentPage === '') {
				this._activeRoute = 'All';
			}
			this._filter();
			this.view.render('setFilter', currentPage);
		}
	}

	// Exporte vers l'objet Window (affichage)
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
