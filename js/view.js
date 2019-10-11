/*global qs, qsa, $on, $parent, $delegate */

(function(window) {
	'use strict';

	/**
	 * Définit les valeurs par défaut du template ainsi que les intéractions avec le DOM (touches du clavier et évènements)
	 * @constructor
	 * @param {string} template Le template utilisé
	 */
	class View {
		constructor(template) {
			this.template = template;
			this.ENTER_KEY = 13;
			this.ESCAPE_KEY = 27;
			this.$todoList = qs('.todo-list');
			this.$todoItemCounter = qs('.todo-count');
			this.$clearCompleted = qs('.clear-completed');
			this.$main = qs('.main');
			this.$footer = qs('.footer');
			this.$toggleAll = qs('.toggle-all');
			this.$newTodo = qs('.new-todo');
		}

		/**
		 * Supprime une tâche de la liste
		 * @param {number} id L'id de la tâche à supprimer
		 */
		_removeItem(id) {
			var elem = qs('[data-id="' + id + '"]');
			if (elem) {
				this.$todoList.removeChild(elem);
			}
		}

		/**
		 * Affiche ou cache les éléments terminés
		 * @param {number} completedCount Le nombre d'éléments terminés
		 * @param {boolean} visible Les éléments sont-ils visibles ou non ?
		 */
		_clearCompletedButton(completedCount, visible) {
			this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
			this.$clearCompleted.style.display = visible ? 'block' : 'none';
		}

		/**
		 * Met en place un filtre dans l'url pour filtrer les tâches de la liste
		 * @param {string} currentPage Le filtre appliqué : '' / active / completed
		 */
		_setFilter(currentPage) {
			qs('.filters .selected').className = '';
			qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
		}

		/**
		 * Test si une tâche est terminée ou non
		 * @param {number} id L'id de la tâche à tester
		 * @param {boolean} completed La tâche est-elle terminée ou non ?
		 */
		_elementComplete(id, completed) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			if (listItem) {
				listItem.className = completed ? 'completed' : '';
				// On définit la tâche comme terminée par défaut
				qs('input', listItem).checked = completed;
			}
		}

		/**
		 * Editer une tâche dans la liste (grâce au double click)
		 * @param {number} id L'id de la tâche à éditer
		 * @param {string} title Le nouveau titre de la tâche
		 */
		_editItem(id, title) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			if (listItem) {
				listItem.className = listItem.className + ' editing';
				var input = document.createElement('input');
				input.className = 'edit';
				listItem.appendChild(input);
				input.focus();
				input.value = title;
			}
		}

		/**
		 * Indique que l'édition d'une tâche est terminée
		 * @param {number} id L'id de la tâche qui était en édition
		 * @param {string} title Le nouveau titre de la tâche
		 */
		_editItemDone(id, title) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			if (listItem) {
				var input = qs('input.edit', listItem);
				listItem.removeChild(input);
				listItem.className = listItem.className.replace('editing', '');
				qsa('label', listItem).forEach(function(label) {
					label.textContent = title;
				});
			}
		}

		/**
		 * Retourne les tâches dans le DOM, côté HTML
		 * @param {string} viewCmd La fonction active
		 * @param {object} parameter Les paramètres actifs
		 */
		render(viewCmd, parameter) {
			var self = this;
			var viewCommands = {
				showEntries: function() {
					self.$todoList.innerHTML = self.template.show(parameter);
				},
				removeItem: function() {
					self._removeItem(parameter);
				},
				updateElementCount: function() {
					self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
				},
				clearCompletedButton: function() {
					self._clearCompletedButton(parameter.completed, parameter.visible);
				},
				contentBlockVisibility: function() {
					self.$main.style.display = self.$footer.style.display = parameter.visible
						? 'block'
						: 'none';
				},
				toggleAll: function() {
					self.$toggleAll.checked = parameter.checked;
				},
				setFilter: function() {
					self._setFilter(parameter);
				},
				clearNewTodo: function() {
					self.$newTodo.value = '';
				},
				elementComplete: function() {
					self._elementComplete(parameter.id, parameter.completed);
				},
				editItem: function() {
					self._editItem(parameter.id, parameter.title);
				},
				editItemDone: function() {
					self._editItemDone(parameter.id, parameter.title);
				},
			};
			viewCommands[viewCmd]();
		}

		/**
		 * Récupère l'id de la tâche grâce à son attribut data en HTML
		 * @param {element} element La tâche dont on cherche l'id
		 * @returns {number} L'id de la tâche
		 */
		_itemId(element) {
			var li = $parent(element, 'li');
			return parseInt(li.dataset.id, 10);
		}

		/**
		 * Définit les actions après l'édition d'une tâche
		 * @param {function} handler Fonction de rappel qui est exécuté après l'édition d'une tâche
		 */
		_bindItemEditDone(handler) {
			var self = this;
			$delegate(self.$todoList, 'li .edit', 'blur', function() {
				if (!this.dataset.iscanceled) {
					handler({
						id: self._itemId(this),
						title: this.value,
					});
				}
			});
			$delegate(self.$todoList, 'li .edit', 'keypress', function(event) {
				if (event.keyCode === self.ENTER_KEY) {
					// Permet de quitter le mode édition lorsqu'on appuie sur Entrée
					this.blur();
				}
			});
		}

		/**
		 * Définit les actions lorsque l'édition d'une tâche est annulée
		 * @param {function} handler Fonction de rappel qui est exécutée lors de l'annulation de l'édition d'une tâche
		 */
		_bindItemEditCancel(handler) {
			var self = this;
			$delegate(self.$todoList, 'li .edit', 'keyup', function(event) {
				if (event.keyCode === self.ESCAPE_KEY) {
					this.dataset.iscanceled = true;
					this.blur();
					handler({ id: self._itemId(this) });
				}
			});
		}

		/**
		 * Greffe des écouteurs d'évènements sur les tâches en fonction des actions de l'utilisateur, côté HTML
		 * @param {string} event L'event choisi
		 * @param {function} handler Fonction de rappel exécutée selon la situation
		 */
		bind(event, handler) {
			var self = this;
			// amélioration
			switch (event) {
				case 'newTodo':
					$on(self.$newTodo, 'change', function() {
						handler(self.$newTodo.value);
					});
					break;
				case 'removeCompleted':
					$on(self.$clearCompleted, 'click', function() {
						handler();
					});
					break;
				case 'toggleAll':
					$on(self.$toggleAll, 'click', function() {
						handler({ completed: this.checked });
					});
					break;
				case 'itemEdit':
					$delegate(self.$todoList, 'li label', 'dblclick', function() {
						handler({ id: self._itemId(this) });
					});
					break;
				case 'itemRemove':
					$delegate(self.$todoList, '.destroy', 'click', function() {
						handler({ id: self._itemId(this) });
					});
					break;
				case 'itemToggle':
					$delegate(self.$todoList, '.toggle', 'click', function() {
						handler({
							id: self._itemId(this),
							completed: this.checked,
						});
					});
					break;
				case 'itemEditDone':
					self._bindItemEditDone(handler);
					break;
				case 'itemEditCancel':
					self._bindItemEditCancel(handler);
					break;
			}
		}
	}

	// Exporte vers l'objet Window (affichage)
	window.app = window.app || {};
	window.app.View = View;
})(window);
