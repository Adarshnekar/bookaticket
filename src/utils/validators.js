/**
 * Form and input validators
 */

export function validatePhone(phone) {
  if (!phone) return false;
  // Clean non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Check if exactly 10 digits or 12 digits starting with 91
  return (
    (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) ||
    (cleaned.length === 12 && /^91[6-9]\d{9}$/.test(cleaned))
  );
}

export function validatePassenger(p, index) {
  const errors = {};
  if (!p.fullName || p.fullName.trim().length < 2) {
    errors.fullName = `Passenger ${index + 1}: Name must be at least 2 characters`;
  }

  const ageNum = parseInt(p.age, 10);
  if (!p.age || isNaN(ageNum) || ageNum < 1 || ageNum > 115) {
    errors.age = `Passenger ${index + 1}: Enter a valid age`;
  } else if (p.type === 'Child' && ageNum > 12) {
    errors.age = `Passenger ${index + 1}: Child age should be 12 or under`;
  } else if (p.type === 'Senior' && ageNum < 60) {
    errors.age = `Passenger ${index + 1}: Senior concession requires age 60+`;
  }

  if (!p.gender) {
    errors.gender = `Passenger ${index + 1}: Select gender`;
  }

  // Primary passenger mobile check
  if (index === 0 && p.mobile && !validatePhone(p.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }

  return errors;
}

export function validateAllPassengers(passengers) {
  const allErrors = [];
  passengers.forEach((p, idx) => {
    const errs = validatePassenger(p, idx);
    const keys = Object.keys(errs);
    if (keys.length > 0) {
      allErrors.push(...keys.map((k) => errs[k]));
    }
  });
  return allErrors;
}

