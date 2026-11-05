/**
 * Calculate fares for BMTC Namma Ride
 */
export function calculateFare({
  bus,
  adultCount = 0,
  childCount = 0,
  seniorCount = 0,
}) {
  const adultRate = bus?.adultFare ?? 35;
  const childRate = bus?.childFare ?? 20;
  const seniorRate = bus?.seniorFare ?? 18;

  const adultSubtotal = adultCount * adultRate;
  const childSubtotal = childCount * childRate;
  const seniorSubtotal = seniorCount * seniorRate;

  const totalPassengers = adultCount + childCount + seniorCount;
  const totalPayable = adultSubtotal + childSubtotal + seniorSubtotal;

  return {
    adultRate,
    childRate,
    seniorRate,
    adultCount,
    childCount,
    seniorCount,
    totalPassengers,
    adultSubtotal,
    childSubtotal,
    seniorSubtotal,
    serviceFee: 0,
    gst: 0,
    totalPayable,
  };
}

