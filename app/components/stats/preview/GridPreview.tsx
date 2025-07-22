import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type GridPreviewProps = {
  title: string;
  caption: string;
  footerValue: string;
  footerUnit: string;
  children: React.ReactNode;
};

export default function GridPreview({ title, caption, footerValue, footerUnit, children }: GridPreviewProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerValue}>{footerValue}</Text>
        <Text style={styles.footerUnit} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {footerUnit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: 16, 
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  footerValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  footerUnit: {
    flexShrink: 1,
    color: '#aaa',
    fontSize: 14,
    fontWeight: '400',
  },
});