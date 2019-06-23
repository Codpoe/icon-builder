export default ($: CheerioStatic): string =>
  $('svg')
    .toString()
    .replace(/stroke="currentColor"/g, 'stroke={color}')
    .replace(/width=".*?"/, 'width={size}')
    .replace(/height=".*?"/, 'height={size}')
    .replace(/class=/, 'className=')
    .replace('restProps="..."', '{...restProps}');
