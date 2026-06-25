function validate(options){
    var errors = [];

    var minTocItems = options.toc.items.min;
if (minTocItems && (isNaN(minTocItems) || minTocItems <= 0)) { errors.push('Min. TOC items specified is not a positive number: ' + minTocItems); }

    var padBeforeTitle = options.toc.title.padding.before;
if (padBeforeTitle && isNaN(padBeforeTitle) || padBeforeTitle < 0) { errors.push('Padding before title specified is not a positive number: ' + padBeforeTitle); }
else if (padBeforeTitle && padBeforeTitle > 1) { errors.push('Padding before title: ' + padBeforeTitle + ' is not currently supported as greater than 1'); }

var maxHeaderLevel = options.heading.level.max;
if (maxHeaderLevel && isNaN(maxHeaderLevel)) { errors.push('Max. heading level specified is not a number: ' + maxHeaderLevel); }

var minHeaderLevel = options.heading.level.min;
if (minHeaderLevel && isNaN(minHeaderLevel) || minHeaderLevel < 0) { errors.push('Min. heading level specified is not a positive number: ' + minHeaderLevel); }
else if (minHeaderLevel && minHeaderLevel > 2) { errors.push('Min. heading level: ' + minHeaderLevel + ' is not currently supported as greater than 2'); }

if (maxHeaderLevel && maxHeaderLevel < minHeaderLevel) { errors.push('Max. heading level: ' + maxHeaderLevel + ' is less than the defined Min. heading level: ' + minHeaderLevel); }

var indentWidth = options.toc.items.indentation.width;
if (indentWidth !== undefined && isNaN(indentWidth)) { errors.push('ToC indentation width: ' + indentWidth + ' is not a number'); }

var indentStyle = options.toc.items.indentation.style;
if (indentStyle && indentStyle !== 'space' && indentStyle !== 'tab') { errors.push('Indentation style not supported: ' + indentStyle); }

var minLines = options.document.lines.min;
if (isNaN(minLines)) { errors.push('Document min lines: ' + minLines + ' is not a number'); }

var location = options.toc.location;
if (location != 'top' && location != 'before') { errors.push('Location specified is not valid: ' + location); }

if (options.toc.pragma.style != "legacy" && options.toc.pragma.style != "compact"){ errors.push('TOC pragma style is not supported: ' + options.toc.pragma.style); }

return errors;
}