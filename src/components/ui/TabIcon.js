/**
 * Tabbar Icon
 *
    <TabIcon icon={'search'} selected={false} />
 *
 */
import React, { PropTypes } from 'react';
import { Icon } from 'react-native-elements';

import { AppColors } from '@theme/';

/* Component ==================================================================== */
const TabIcon = ({ icon, type, size,  selected }) => (
  <Icon
    name={icon}
    size={size}
    type={type}
    color={selected ? AppColors.tabbar.iconSelected : AppColors.tabbar.iconDefault}
  />
);

TabIcon.propTypes = { icon: PropTypes.string.isRequired, size:PropTypes.number, type: PropTypes.string, selected: PropTypes.bool };
TabIcon.defaultProps = { icon: 'search', selected: false, size:26 };

/* Export Component ==================================================================== */
export default TabIcon;
