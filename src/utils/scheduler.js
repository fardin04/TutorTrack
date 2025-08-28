export default function generateSchedule(students = [], availability = {}) {
  // Initialize schedule with all days
  const schedule = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };

  if (!students.length) {
    return schedule;
  }
  
  if (!Object.keys(availability).length) {
    return schedule;
  }

  // Sort students by classes per week (highest first)
  const sortedStudents = [...students].sort((a, b) => b.clsPerWeek - a.clsPerWeek);

  // First pass: Try to distribute classes evenly
  for (const student of sortedStudents) {
    const { name, clsPerWeek, unavailableDays = [] } = student;
    let classesScheduled = 0;

    // Get available days that both student and tutor can do
    const availableDays = Object.keys(availability)
      .filter(day => 
        !unavailableDays.includes(day) && 
        schedule[day].length < availability[day]
      );

    // Sort by least scheduled days first to distribute evenly
    availableDays.sort((a, b) => schedule[a].length - schedule[b].length);

    // Assign to available days
    for (const day of availableDays) {
      if (classesScheduled >= clsPerWeek) break;
      if (schedule[day].length < availability[day]) {
        schedule[day].push(name);
        classesScheduled++;
      }
    }
  }

  // Second pass: Handle any remaining classes for students who couldn't get all their slots
  for (const student of sortedStudents) {
    const { name, clsPerWeek, unavailableDays = [] } = student;
    const currentClasses = Object.values(schedule).flat().filter(n => n === name).length;
    let remainingClasses = clsPerWeek - currentClasses;

    if (remainingClasses > 0) {
      // Find any available slot (even if it means exceeding tutor's preferred max)
      const allAvailableDays = Object.keys(availability)
        .filter(day => !unavailableDays.includes(day));

      for (const day of allAvailableDays) {
        if (remainingClasses <= 0) break;
        schedule[day].push(name);
        remainingClasses--;
      }
    }
  }

  return schedule;
}