export const ROADMAP_FIELDS = [
  {
    id: 'level',
    label: 'Current Skill Level',
    options: [
      { value: 'Beginner (No experience)', label: 'Beginner (No experience)' },
      { value: 'Intermediate (Know basics)', label: 'Intermediate (Know basics)' },
      { value: 'Advanced (Looking to specialize)', label: 'Advanced (Looking to specialize)' }
    ]
  },
  {
    id: 'hours',
    label: 'Daily Study Commitment',
    options: [
      { value: '1-2 Hours/day', label: 'Light (1-2 Hours/day)' },
      { value: '3-4 Hours/day', label: 'Moderate (3-4 Hours/day)' },
      { value: '5+ Hours/day', label: 'Intensive (5+ Hours/day)' }
    ]
  },
  {
    id: 'style',
    label: 'Preferred Learning Style',
    options: [
      { value: 'Visual (Videos & Interactive Labs)', label: 'Visual (Videos & Interactive Labs)' },
      { value: 'Text-based (Documentation & Books)', label: 'Text-based (Documentation & Books)' },
      { value: 'Practical (Project-first building)', label: 'Practical (Project-first building)' }
    ]
  },
  {
    id: 'budget',
    label: 'Budget Allocation',
    options: [
      { value: 'Free resources only', label: 'Strictly Free Resources' },
      { value: 'Paid courses / certifications OK', label: 'Open to Paid Courses/Certifications' }
    ]
  }
];