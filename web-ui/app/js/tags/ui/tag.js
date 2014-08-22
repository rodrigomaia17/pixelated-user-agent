/*
 * Copyright (c) 2014 ThoughtWorks, Inc.
 *
 * Pixelated is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pixelated is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pixelated. If not, see <http://www.gnu.org/licenses/>.
 */
/*global _ */

define(
  [
    'flight/lib/component',
    'views/templates',
    'tags/ui/tag_base',
    'page/events',
    'views/i18n'
  ],

  function (defineComponent, templates, tagBase, events, i18n) {
    'use strict';

    var Tag = defineComponent(tag, tagBase);

    Tag.appendedTo = function (parent, data) {
      var res = new this();
      res.renderAndAttach(parent, data);
      return res;
    };

    return Tag;

    function tag() {
    
      this.viewFor = function (tag, template) {
        return template({
          tagName: tag.default ? i18n("tags." + tag.name) : tag.name,
          ident: tag.ident,
          count: this.badgeType(tag) === 'total' ? tag.counts.total : (tag.counts.total - tag.counts.read),
          displayBadge: this.displayBadge(tag),
          badgeType: this.badgeType(tag),
          icon: tag.icon
        });
      };

      this.decreaseReadCountIfMatchingTag = function (ev, data) {
        if (_.contains(data.tags, this.attr.tag.name)) {
          this.attr.tag.counts.read++;
          this.$node.html(this.viewFor(this.attr.tag, templates.tags.tagInner));
        }
      };

      this.triggerSelect = function () {
        this.trigger(document, events.ui.tag.select, { tag: this.attr.tag.name });
        this.trigger(document, events.search.empty);
      };

      this.selectTag = function (ev, data) {
        data.tag === this.attr.tag.name ? this.doSelect(data) : this.doUnselect();
      };

      this.doUnselect = function () {
        this.attr.selected = false;
        this.$node.removeClass('selected');
      };

      this.doSelect = function (data) {
        this.attr.selected = true;
        this.$node.addClass('selected');
        this.trigger(document, events.ui.mails.cleanSelected);
        this.trigger(document, events.ui.tag.selected, data);
      };

      this.addSearchingClass = function() {
        if (this.attr.tag.name === 'all'){
          this.$node.addClass('searching');
        }
      };

      this.removeSearchingClass = function() {
        if (this.attr.tag.name === 'all'){
          this.$node.removeClass('searching');
        }
      };

      this.after('initialize', function () {
        this.on('click', this.triggerSelect);
        this.on(document, events.ui.tag.select, this.selectTag);
        this.on(document, events.mail.read, this.decreaseReadCountIfMatchingTag);
        this.on(document, events.search.perform, this.addSearchingClass);
        this.on(document, events.search.empty, this.removeSearchingClass);
      });

      this.renderAndAttach = function (parent, data) {
        var rendered = this.viewFor(data.tag, templates.tags.tag);
        parent.append(rendered);
        this.initialize('#tag-' + data.tag.ident, data);
        this.on(parent, events.tags.teardown, this.teardown);
      };
    }
  }
);
