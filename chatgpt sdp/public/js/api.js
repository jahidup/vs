/* ==========================================================================
   Sankalp Digital Pathshala - Client API Wrapper (Inquiries, Leads)
   ========================================================================== */

const API = {
  // Post an inquiry form submission
  submitInquiry: async (formData) => {
    try {
      const response = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      return await response.json();
    } catch (e) {
      console.error('Failed to submit inquiry:', e);
      return { success: false, message: 'Server unreachable. Please check your internet connection and try again.' };
    }
  },

  // Perform AI lead classification checks
  logAILead: async (leadData) => {
    try {
      const response = await fetch('/api/lead-scoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });
      return await response.json();
    } catch (e) {
      console.error('AI lead logging failed:', e);
      return { success: false };
    }
  }
};
