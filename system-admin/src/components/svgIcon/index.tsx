import './index.less';

export const SvgIcon = (props: any) => {
  const className: string = props?.className ?? null;
  const iconClass: string = props.iconClass;
  const svgClass = className ? 'svg-icon ' + className : 'svg-icon';
  const iconName = `#${iconClass}`;
  return (
    <svg className={svgClass} aria-hidden="true">
      <use xlinkHref={iconName} />
    </svg>
  );
};
