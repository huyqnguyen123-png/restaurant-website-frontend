import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import OpeningHoursList from '../components/OpeningHoursList'
import { RESTAURANT_ADDRESS, RESTAURANT_PHONE, RESTAURANT_EMAIL } from '../utils/restaurantInfo'

export default function Contact() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const isValid = name.trim() !== '' && email.trim() !== '' && message.trim() !== ''

  // Opens the customer's own email client with the message pre-filled,
  // addressed to the restaurant — no backend mail server required.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const subject = encodeURIComponent(`Website inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)
    window.location.href = `mailto:${RESTAURANT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl mb-8">{t('contact.title')}</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('contact.address')}</p>
            <p className="font-medium">{RESTAURANT_ADDRESS}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('contact.phone')}</p>
            <a href={`tel:${RESTAURANT_PHONE.replace(/\s/g, '')}`} className="font-medium hover:text-primary transition-colors">
              {RESTAURANT_PHONE}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('contact.email')}</p>
            <a href={`mailto:${RESTAURANT_EMAIL}`} className="font-medium hover:text-primary transition-colors">
              {RESTAURANT_EMAIL}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">{t('contact.openingHours')}</p>
            <div className="bg-surface border border-border-subtle rounded-lg p-4">
              <OpeningHoursList />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('Full Name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Full Name') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('Email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('you@example.com') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('contact.message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('contact.messagePlaceholder') ?? ''}
              rows={6}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold px-6 py-3 rounded"
          >
            {t('contact.sendButton')}
          </button>
        </form>
      </div>
    </div>
  )
}