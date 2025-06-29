import React, { useState } from "react";

const Newsletter = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setFormData({ fullName: "", email: "" });
    } catch (error) {
      console.error("Newsletter signup failed", error);
    }
  };

  return (
    <section className="bg-[#964B00]/10 px-4 py-10 md:px-12 lg:px-32">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h3 className="text-xl md:text-2xl font-semibold text-[#964B00] mb-4">
          Subscribe to our Newsletter
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="border p-3 rounded-md focus:outline-[#964B00]"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border p-3 rounded-md focus:outline-[#964B00]"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="md:col-span-2 bg-[#964B00] text-white py-3 px-6 rounded-md hover:opacity-90 transition duration-300"
          >
            Subscribe
          </button>
          {success && (
            <p className="text-green-600 md:col-span-2 animate-fade-in">Thanks for subscribing!</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
