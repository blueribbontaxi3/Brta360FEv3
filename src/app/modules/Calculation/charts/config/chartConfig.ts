export const CHART_COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  tertiary: '#ffc658',
  background: '#fff'
};

export const CHART_STYLES = {
  title: {
    marginBottom: 12
  },
  container: {
    width: '100%',
    height: 240, // Reduced height for better fit
    minHeight: 240
  } as const
};

export const AXIS_CONFIG = {
  stroke: '#666',
  strokeDasharray: '3 3'
};