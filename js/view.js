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
		_removeItem(id) {
			var elem = qs('[data-id="' + id + '"]');
			if (elem) {
				this.$todoList.removeChild(elem);
			}
		}
		_clearCompletedButton(completedCount, visible) {
			this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
			this.$clearCompleted.style.display = visible ? 'block' : 'none';
		}
		_setFilter(currentPage) {
			qs('.filters .selected').className = '';
			qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
		}
		_elementComplete(id, completed) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			// if (!listItem) {
			// 	return;
			// }
			if (listItem) {
				listItem.className = completed ? 'completed' : '';
				// On définit la tâche comme terminée par défaut
				qs('input', listItem).checked = completed;
			}
		}
		_editItem(id, title) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			// if (!listItem) {
			// 	return;
			// }
			if (listItem) {
				listItem.className = listItem.className + ' editing';
				var input = document.createElement('input');
				input.className = 'edit';
				listItem.appendChild(input);
				input.focus();
				input.value = title;
			}
		}
		_editItemDone(id, title) {
			var listItem = qs('[data-id="' + id + '"]');
			// amélioration
			// if (!listItem) {
			// 	return;
			// }
			if (listItem) {
				var input = qs('input.edit', listItem);
				listItem.removeChild(input);
				listItem.className = listItem.className.replace('editing', '');
				qsa('label', listItem).forEach(function(label) {
					label.textContent = title;
				});
			}
		}
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
		_itemId(element) {
			var li = $parent(element, 'li');
			return parseInt(li.dataset.id, 10);
		}
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
			// if (event === 'newTodo') {
			// 	$on(self.$newTodo, 'change', function() {
			// 		handler(self.$newTodo.value);
			// 	});
			// } else if (event === 'removeCompleted') {
			// 	$on(self.$clearCompleted, 'click', function() {
			// 		handler();
			// 	});
			// } else if (event === 'toggleAll') {
			// 	$on(self.$toggleAll, 'click', function() {
			// 		handler({ completed: this.checked });
			// 	});
			// } else if (event === 'itemEdit') {
			// 	$delegate(self.$todoList, 'li label', 'dblclick', function() {
			// 		handler({ id: self._itemId(this) });
			// 	});
			// } else if (event === 'itemRemove') {
			// 	$delegate(self.$todoList, '.destroy', 'click', function() {
			// 		handler({ id: self._itemId(this) });
			// 	});
			// } else if (event === 'itemToggle') {
			// 	$delegate(self.$todoList, '.toggle', 'click', function() {
			// 		handler({
			// 			id: self._itemId(this),
			// 			completed: this.checked,
			// 		});
			// 	});
			// } else if (event === 'itemEditDone') {
			// 	self._bindItemEditDone(handler);
			// } else if (event === 'itemEditCancel') {
			// 	self._bindItemEditCancel(handler);
			// }
		}
	}

	// Exporte vers l'objet Window (affichage)
	window.app = window.app || {};
	window.app.View = View;
})(window);
