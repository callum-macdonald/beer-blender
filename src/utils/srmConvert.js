export default function srmConvert(srmEstimate) {
    const colorHashTable = {
      1: '#FFE699',
      2: '#FFD878',
      3: '#FFCA5A',
      4: '#FFBF42',
      5: '#FBB123',
      6: '#F8A600',
      7: '#F39C00',
      8: '#EA8F00',
      9: '#E58500',
      10: '#DE7C00',
      11: '#D77200',
      12: '#CF6900',
      13: '#CB6200',
      14: '#C35900',
      15: '#BB5100',
      16: '#B54C00',
      17: '#B04500',
      18: '#A63E00',
      19: '#A13700',
      20: '#9B3200',
      21: '#952D00',
      22: '#8E2900',
      23: '#882300',
      24: '#821E00',
      25: '#7B1A00',
      26: '#771900',
      27: '#701400',
      28: '#6A0E00',
      29: '#660D00',
      30: '#5E0B00',
      31: '#5A0A02',
      32: '#600903',
      33: '#520907',
      34: '#4C0505',
      35: '#470606',
      36: '#440607',
      37: '#3F0708',
      38: '#3B0607',
      39: '#3A070B',
      40: '#36080A',
    };

    // Check if the SRM estimate is a number
    if (isNaN(srmEstimate)) {
      // return default color if not number
      return colorHashTable[1];
    }
    else { 
      // Round the SRM estimate to the nearest whole number
      const roundedNumber = Math.round(srmEstimate);
      // Clamp the rounded number between 1 and 30 (inclusive)
      const clampedNumber = Math.max(1, Math.min(roundedNumber, 40));
      return colorHashTable[clampedNumber];
    }
  }