import React, { useState } from 'react';
import Select from 'react-select';

const HOOK_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'question', label: 'Question Hooks' },
  { value: 'statistic', label: 'Statistic Hooks' },
  { value: 'anecdotal', label: 'Anecdotal Hooks' },
  { value: 'quotation', label: 'Quotation Hooks' },
  { value: 'provocative', label: 'Provocative Hooks' },
  { value: 'humorous', label: 'Humorous Hooks' },
  { value: 'mystery', label: 'Mystery Hooks' },
  { value: 'inspirational', label: 'Inspirational Hooks' },
  { value: 'direct-address', label: 'Direct Address Hooks' },
  { value: 'factual', label: 'Factual/Informative Hooks' },
];

const LINKEDIN_HOOKS = [
  {
    id: 'question-1',
    label: 'Challenge Question',
    text: "Why is [topic] so challenging for [audience] to master?",
    category: 'question',
  },
  {
    id: 'question-2',
    label: 'Wonder Question',
    text: "Have you ever wondered how [activity] leads to [outcome]?",
    category: 'question',
  },
  {
    id: 'question-3',
    label: 'What-If Question',
    text: "What would happen if you stopped doing [facing problem]?",
    category: 'question',
  },
  // Add more hooks as needed
].sort(() => Math.random() - 0.5);

export default function HooksPanel({ editor }) {
  const [selectedCategory, setSelectedCategory] = useState({ value: 'all', label: 'All' });

  const insertHook = (text) => {
    editor.chain().focus().insertContent(text).run();
  };

  const filteredHooks = LINKEDIN_HOOKS.filter(
    hook => selectedCategory.value === 'all' || hook.category === selectedCategory.value
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select
          value={selectedCategory}
          onChange={(newValue) => setSelectedCategory(newValue)}
          options={HOOK_CATEGORIES}
          className="w-full"
          classNamePrefix="select"
        />
      </div>

      <div className="grid gap-3">
        {filteredHooks.map((hook) => (
          <button
            key={hook.id}
            onClick={() => insertHook(hook.text)}
            className="p-4 text-left border rounded-lg hover:bg-gray-50"
          >
            <h3 className="font-medium mb-1">{hook.label}</h3>
            <p className="text-sm text-gray-600">{hook.text}</p>
            <span className="text-xs text-blue-600 mt-2 inline-block">
              {HOOK_CATEGORIES.find(cat => cat.value === hook.category)?.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}