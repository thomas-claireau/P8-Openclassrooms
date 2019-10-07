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
		 * @param {string} id L'id du model (correspondant à la tâche à éditer)
		 */
		editItem(id) {
			var self = this;
			self.model.read(id, function(data) {
				self.view.render('editItem', { id: id, title: data[0].title });
			});
		}

		/*
		 * Finishes the item editing mode successfully.
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
		/*
		 * Cancels the item editing mode.
		 */
		editItemCancel(id) {
			var self = this;
			self.model.read(id, function(data) {
				self.view.render('editItemDone', { id: id, title: data[0].title });
			});
		}
		/**
		 * By giving it an ID it'll find the DOM element matching that ID,
		 * remove it from the DOM and also remove it from storage.
		 *
		 * @param {number} id The ID of the item to remove from the DOM and
		 * storage
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
		 * Will remove all completed items from the DOM and storage.
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
		 * Give it an ID of a model and a checkbox and it will update the item
		 * in storage based on the checkbox's state.
		 *
		 * @param {number} id The ID of the element to complete or uncomplete
		 * @param {object} checkbox The checkbox to check the state of complete
		 *                          or not
		 * @param {boolean|undefined} silent Prevent re-filtering the todo items
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
		 * Will toggle ALL checkboxes' on/off state and completeness of models.
		 * Just pass in the event object.
		 */
		toggleAll(completed) {
			var self = this;
			self.model.read({ completed: !completed }, function(data) {
				data.forEach(function(item) {
					self.toggleComplete(item.id, completed, true);
				});
			});
			self._filter();
		}
		/**
		 * Updates the pieces of the page which change depending on the remaining
		 * number of todos.
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
		 * Re-filters the todo items, based on the active route.
		 * @param {boolean|undefined} force  forces a re-painting of todo items.
		 */
		_filter(force) {
			var activeRoute =
				this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);
			// Update the elements on the page, which change with each completed todo
			this._updateCount();
			// If the last active route isn't "All", or we're switching routes, we
			// re-create the todo item elements, calling:
			//   this.show[All|Active|Completed]();
			if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
				this['show' + activeRoute]();
			}
			this._lastActiveRoute = activeRoute;
		}
		/**
		 * Simply updates the filter nav's selected states
		 */
		_updateFilterState(currentPage) {
			// Store a reference to the active route, allowing us to re-filter todo
			// items as they are marked complete or incomplete.
			this._activeRoute = currentPage;
			if (currentPage === '') {
				this._activeRoute = 'All';
			}
			this._filter();
			this.view.render('setFilter', currentPage);
		}
	}

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
