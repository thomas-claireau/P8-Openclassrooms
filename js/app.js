/*global app, $on */
(function() {
	'use strict';

	/**
	 * Initialise une nouvelle liste de tâche.
	 * @constructor
	 * @param {string} name Le nom de la nouvelle liste de tâche.
	 */
	class Todo {
		constructor(name) {
			this.storage = new app.Store(name);
			this.model = new app.Model(this.storage);
			this.template = new app.Template();
			this.view = new app.View(this.template);
			this.controller = new app.Controller(this.model, this.view);
		}
	}

	var todo = new Todo('todos-vanillajs');

	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
