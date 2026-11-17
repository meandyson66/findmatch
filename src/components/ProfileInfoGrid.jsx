import { Briefcase, GraduationCap, Heart, MapPin, Ruler, Wallet } from 'lucide-react'
import {
  EDUCATION_OPTIONS,
  INCOME_OPTIONS,
  JOB_SUGGESTIONS,
  MARITAL_OPTIONS,
} from '../data/profileOptions'

export function formatJobLine(user) {
  const parts = [user?.job, user?.jobTitle].filter(Boolean)
  return parts.length ? parts.join(' · ') : '未填写'
}

export function ProfileInfoGrid({ user }) {
  const items = [
    { icon: Briefcase, label: '工作', value: formatJobLine(user) },
    { icon: GraduationCap, label: '学历', value: user?.education || '未填写' },
    { icon: Wallet, label: '收入', value: user?.income || '未填写' },
    {
      icon: Ruler,
      label: '身高',
      value: user?.heightCm ? `${user.heightCm} cm` : '未填写',
    },
    { icon: Heart, label: '情感', value: user?.marital || '未填写' },
  ]
  if (user?.company) {
    items.splice(1, 0, { icon: Briefcase, label: '公司', value: user.company })
  }
  if (user?.hometown) {
    items.push({ icon: MapPin, label: '家乡', value: user.hometown })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="glass-panel-sm flex items-start gap-2 px-3 py-2.5">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-momo" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="text-[10px] text-momo-sub">{label}</p>
            <p className="truncate text-xs font-medium text-momo-text">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChipSelect({ label, options, value, onChange }) {
  return (
    <div className="mb-3 px-4">
      <span className="text-xs text-momo-sub">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-2.5 py-1 text-xs ${
              value === opt
                ? 'glass-primary-btn'
                : 'border border-white/50 bg-white/35 text-momo-sub backdrop-blur-md'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProfileExtraFields({ form, setForm }) {
  return (
    <>
      <ChipSelect
        label="学历"
        options={EDUCATION_OPTIONS}
        value={form.education}
        onChange={(v) => setForm((f) => ({ ...f, education: v }))}
      />
      <ChipSelect
        label="月收入"
        options={INCOME_OPTIONS}
        value={form.income}
        onChange={(v) => setForm((f) => ({ ...f, income: v }))}
      />
      <ChipSelect
        label="情感状态"
        options={MARITAL_OPTIONS}
        value={form.marital}
        onChange={(v) => setForm((f) => ({ ...f, marital: v }))}
      />
      <label className="mb-3 block px-4">
        <span className="text-xs text-momo-sub">行业</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {JOB_SUGGESTIONS.map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => setForm((f) => ({ ...f, job: j }))}
              className={`rounded-full px-2.5 py-1 text-xs ${
                form.job === j
                  ? 'glass-primary-btn'
                  : 'border border-white/50 bg-white/35 text-momo-sub'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </label>
      <label className="mb-3 block px-4">
        <span className="text-xs text-momo-sub">职位 / 工作内容</span>
        <input
          value={form.jobTitle ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
          placeholder="如：产品经理、教师"
          className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
          maxLength={24}
        />
      </label>
      <label className="mb-3 block px-4">
        <span className="text-xs text-momo-sub">公司（选填）</span>
        <input
          value={form.company ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
          maxLength={30}
        />
      </label>
      <label className="mb-3 block px-4">
        <span className="text-xs text-momo-sub">身高（cm）</span>
        <input
          type="number"
          value={form.heightCm ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))}
          className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
          min={140}
          max={220}
        />
      </label>
      <label className="mb-3 block px-4">
        <span className="text-xs text-momo-sub">家乡（选填）</span>
        <input
          value={form.hometown ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, hometown: e.target.value }))}
          placeholder="如：浙江杭州"
          className="mt-1 w-full rounded-lg glass-input px-3 py-2 text-sm outline-none"
          maxLength={20}
        />
      </label>
    </>
  )
}