export const sections = [
  {
    id: 1,
    title: 'About You',
    description: 'Tell us about your professional background.',
    questions: [
      {
        id: 'Q1',
        type: 'text',
        label: 'What is your job title?',
        placeholder: 'e.g. Software Engineer, Registered Nurse, Financial Analyst',
      },
      {
        id: 'Q2',
        type: 'text',
        label: 'What industry do you work in?',
        placeholder: 'e.g. Healthcare, Finance, Manufacturing, Tech',
      },
      {
        id: 'Q3',
        type: 'select',
        label: 'How many years have you worked in this field?',
        options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10-20 years', '20+ years'],
      },
      {
        id: 'Q4',
        type: 'select',
        label: 'What is your approximate annual income?',
        options: ['Under $30,000', '$30,000–$60,000', '$60,000–$100,000', '$100,000–$150,000', '$150,000+'],
      },
      {
        id: 'Q5',
        type: 'radio',
        label: 'What level are you?',
        options: ['Entry', 'Mid-Level', 'Senior', 'Management', 'Executive'],
      },
    ],
  },
  {
    id: 2,
    title: 'Task Analysis',
    description: 'How is your day-to-day work structured?',
    questions: [
      {
        id: 'Q6',
        type: 'radio',
        label: 'How much of your job follows the same process every day?',
        options: ['0-20%', '21-50%', '51-80%', '81-100%'],
      },
      {
        id: 'Q7',
        type: 'radio',
        label: 'How often do you make decisions using judgment instead of rules?',
        options: ['Never', 'Sometimes', 'Often', 'Daily'],
      },
      {
        id: 'Q8',
        type: 'radio',
        label: 'How much of your work involves repetitive data entry?',
        options: ['0-20%', '21-50%', '51-80%', '81-100%'],
      },
      {
        id: 'Q9',
        type: 'radio',
        label: 'How much of your work involves physical labor?',
        options: ['0-20%', '21-50%', '51-80%', '81-100%'],
      },
      {
        id: 'Q10',
        type: 'radio',
        label: 'How much of your work requires creativity?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      },
    ],
  },
  {
    id: 3,
    title: 'Human Interaction',
    description: 'How much does your job depend on people skills and relationships?',
    questions: [
      {
        id: 'Q11',
        type: 'radio',
        label: 'How much of your job requires face-to-face interaction?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
      },
      {
        id: 'Q12',
        type: 'radio',
        label: 'How important is trust and relationship building in your job?',
        options: ['Not at all', 'A little', 'Moderately', 'A lot', 'Entirely'],
      },
      {
        id: 'Q13',
        type: 'radio',
        label: 'Do people rely on your expertise and judgment?',
        options: ['Rarely', 'Sometimes', 'Often', 'Very often', 'Constantly'],
      },
      {
        id: 'Q14',
        type: 'radio',
        label: 'How much negotiation is involved in your job?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
      },
      {
        id: 'Q15',
        type: 'radio',
        label: "How often do you solve unique problems that don't have a clear answer?",
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
      },
    ],
  },
  {
    id: 4,
    title: 'Technology Exposure',
    description: 'How much is your work already digital or automatable?',
    questions: [
      {
        id: 'Q16',
        type: 'radio',
        label: 'Has AI already been introduced into your workplace?',
        options: ['Not at all', 'Slightly', 'Moderately', 'Heavily'],
      },
      {
        id: 'Q17',
        type: 'radio',
        label: 'Are software systems currently replacing parts of your work?',
        options: ['Not at all', 'Slightly', 'Moderately', 'Significantly'],
      },
      {
        id: 'Q18',
        type: 'radio',
        label: 'Could your work be done remotely through a computer?',
        options: ['No', 'Partially', 'Fully'],
      },
      {
        id: 'Q19',
        type: 'radio',
        label: 'Could your work be completed using only information and knowledge?',
        options: ['No', 'Partially', 'Mostly', 'Entirely'],
      },
      {
        id: 'Q20',
        type: 'radio',
        label: 'How much of your work requires physically being present?',
        options: ['None', 'A little', 'Some', 'Most', 'All of it'],
      },
    ],
  },
  {
    id: 5,
    title: 'Market Demand',
    description: 'How protected is your role in the current job market?',
    questions: [
      {
        id: 'Q21',
        type: 'radio',
        label: 'Are employers currently struggling to find workers in your field?',
        options: ['No not really', 'Somewhat', 'Yes significantly'],
      },
      {
        id: 'Q22',
        type: 'radio',
        label: 'Do you need licenses, certifications, or specialized training?',
        options: ['None required', 'Some training', 'Certification required', 'Formal license required'],
      },
      {
        id: 'Q23',
        type: 'radio',
        label: 'How difficult would it be to replace you with a new employee?',
        options: ['Very easy', 'Somewhat easy', 'Difficult', 'Very difficult'],
      },
      {
        id: 'Q24',
        type: 'radio',
        label: 'How long would it take to train a replacement?',
        options: ['Less than 1 month', '1-6 months', '6 months-2 years', '2+ years'],
      },
      {
        id: 'Q25',
        type: 'radio',
        label: 'Do regulations require a human to perform critical parts of your job?',
        options: ['No', 'Some parts', 'Yes always'],
      },
    ],
  },
  {
    id: 6,
    title: 'Future Readiness',
    description: 'How prepared are you to adapt as the world of work evolves?',
    questions: [
      {
        id: 'Q26',
        type: 'radio',
        label: 'How often do you actively learn new skills?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
      },
      {
        id: 'Q27',
        type: 'radio',
        label: 'How comfortable are you using AI tools?',
        options: ['Not comfortable', 'Slightly comfortable', 'Comfortable', 'Very comfortable', 'Expert level'],
      },
      {
        id: 'Q28',
        type: 'radio',
        label: 'Would you adapt your duties if technology changed your role?',
        options: ['No unlikely', 'Maybe', 'Yes easily'],
      },
      {
        id: 'Q29',
        type: 'radio',
        label: 'Would you be willing to learn a new skill for higher pay?',
        options: ['No', 'Maybe', 'Yes'],
      },
      {
        id: 'Q30',
        type: 'radio',
        label: 'Would you be willing to switch careers if necessary?',
        options: ['No', 'Maybe', 'Yes'],
      },
    ],
  },
  {
    id: 7,
    title: 'In Your Own Words',
    description: 'Help us understand your job at a deeper level.',
    questions: [
      {
        id: 'Q31',
        type: 'textarea',
        label: 'Describe your job in your own words.',
        placeholder:
          'What do you do each day? What responsibilities do you have? What problems do you solve? What makes someone good at your job?',
      },
    ],
  },
];
