function validate(options){
    var errors = [];
    
    if (isNaN(options.toc.items.min) || options.toc.items.min <= 0) { errors.push('Min. TOC items specified is not a positive number: ' + minTocItems); }
    if (options.toc.title.padding.before && (isNaN(options.toc.title.padding.before) || options.toc.title.padding.before < 0) { errors.push('Padding before title specified is not a positive number: ' + padBeforeTitle); }
    else if (options.toc.title.padding.before && options.toc.title.padding.before > 1) { errors.push('Padding before title: ' + padBeforeTitle + ' is not currently supported as greater than 1'); }

    if (options.heading.level.max && isNaN(options.heading.level.max)) { errors.push('Max. heading level specified is not a number: ' + maxHeaderLevel); }
    if (isNaN(options.heading.level.min) || options.heading.level.min < 0) { errors.push('Min. heading level specified is not a positive number: ' + minHeaderLevel); }
    else if (options.heading.level.min > 2) { errors.push('Min. heading level: ' + minHeaderLevel + ' is not currently supported as greater than 2'); }
    if (options.heading.level.max && options.heading.level.max < options.heading.level.min) { errors.push('Max. heading level: ' + maxHeaderLevel + ' is less than the defined Min. heading level: ' + minHeaderLevel); }

    if (isNaN(options.toc.items.indentation.width)) { errors.push('ToC indentation width: ' + indentWidth + ' is not a number'); }
    if (options.toc.items.indentation.style !== 'space' && options.toc.items.indentation.style !== 'tab') { errors.push('Indentation style not supported: ' + indentStyle); }

    if (isNaN(options.document.lines.min)) { errors.push('Document min lines: ' + minLines + ' is not a number'); }
    if (options.toc.location != 'top' && options.toc.location != 'before') { errors.push('Location specified is not valid: ' + location); }
    if (options.toc.pragma.style != "legacy" && options.toc.pragma.style != "compact"){ errors.push('TOC pragma style is not supported: ' + options.toc.pragma.style); }

    return errors;
}