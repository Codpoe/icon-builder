import * as prettier from 'prettier';
import renderSvg from './render-svg';

export default ($: CheerioStatic, name: string): string => {
  const component = `
    import React from 'react';
    import PropTypes from 'prop-types'

    export const ${name} = props => {
      const { color, size, style, ...restProps } = props;
      return (
        ${renderSvg($)}
      )
    };

    ${name}.propTypes = {
      color: PropTypes.string,
      size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }

    ${name}.defaultProps = {
      color: 'currentColor',
      size: '1em',
    }

    export default ${name};
  `;

  return prettier.format(component, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });
};
