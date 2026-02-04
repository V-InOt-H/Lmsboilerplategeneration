const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  organization: {
    name: {
      type: String,
      default: 'Zoho Learning'
    },
    logo: {
      type: String,
      default: null
    },
    primaryColor: {
      type: String,
      default: '#6366f1'
    },
    secondaryColor: {
      type: String,
      default: '#8b5cf6'
    },
    favicon: {
      type: String,
      default: null
    }
  },
  email: {
    fromName: {
      type: String,
      default: 'Zoho Learning'
    },
    fromEmail: {
      type: String,
      default: 'noreply@zoholearning.com'
    },
    enableNotifications: {
      type: Boolean,
      default: true
    }
  },
  features: {
    enableCertificates: {
      type: Boolean,
      default: true
    },
    enableKnowledgeBase: {
      type: Boolean,
      default: true
    },
    enableAssessments: {
      type: Boolean,
      default: true
    },
    enableDiscussions: {
      type: Boolean,
      default: false
    }
  },
  security: {
    passwordMinLength: {
      type: Number,
      default: 6
    },
    sessionTimeout: {
      type: Number,
      default: 60 // minutes
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
