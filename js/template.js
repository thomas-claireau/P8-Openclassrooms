/*jshint laxbreak:true */
(function(window) {
	'use strict';

	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;',
	};

	var escapeHtmlChar = function(chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g;
	var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

	var escape = function(string) {
		return string && reHasUnescapedHtml.test(string)
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			: string;
	};

	/**
	 * Définit le template utilisé pour afficher les tâches
	 *
	 * @constructor
	 */
	class Template {
		constructor() {
			this.defaultTemplate =
				'<li data-id="{{id}}" class="{{completed}}">' +
				'<div class="view">' +
				'<input class="toggle" type="checkbox" {{checked}}>' +
				'<label>{{title}}</label>' +
				'<button class="destroy"></button>' +
				'</div>' +
				'</li>';
		}

		/**
		 * Crée un élément HTML <li> et place le template dans l'application.
		 *
		 * Normalement, il est conseillé d'utiliser un moteur de template comme Mustache ou Handlebars.
		 *
		 * Pour simplifier notre application, nous avons décidé de créer un template en vanilla JS.
		 *
		 * @param {object} data L'objet contenant les informations à remplacer dans le template.
		 * @returns {string} Le template HTML contenant l'élément <li>
		 *
		 * @example
		 * view.show({
		 *	id: 1, // l'id de la tâche
		 *	title: "Hello World", // le titre de la tâche
		 *	completed: 0, // la tâche est par défaut non terminée
		 * });
		 */
		show(data) {
			var i, l;
			var view = '';
			for (i = 0, l = data.length; i < l; i++) {
				var template = this.defaultTemplate;
				var completed = '';
				var checked = '';
				if (data[i].completed) {
					completed = 'completed';
					checked = 'checked';
				}
				template = template.replace('{{id}}', data[i].id);
				template = template.replace('{{title}}', escape(data[i].title));
				template = template.replace('{{completed}}', completed);
				template = template.replace('{{checked}}', checked);
				view = view + template;
			}
			return view;
		}

		/**
		 * Affiche un compteur de tâches actives en bas à gauche de l'application
		 *
		 * @param {number} activeTodos Le nombre de tâches actives
		 * @returns {string} La chaine de caractère contenant le nombre
		 */
		itemCounter(activeTodos) {
			var plural = activeTodos === 1 ? '' : 's';
			return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
		}

		/**
		 * Updates the text within the "Clear completed" button
		 * Affiche ou non le bouton "Clear Completed" (si pas de tâches terminées = pas de bouton)
		 *
		 * @param  {number} completedTodos Le nombre de tâche complétées
		 * @returns {string} La chaine de caractère contenant le texte du bouton.
		 */
		clearCompletedButton(completedTodos) {
			if (completedTodos > 0) {
				return 'Clear completed';
			} else {
				return '';
			}
		}
	}

	// Exporte vers l'objet Window (affichage)
	window.app = window.app || {};
	window.app.Template = Template;
})(window);
