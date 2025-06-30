
import React, { useState } from "react";
import PageHead from "../components/PageHead";
import contactImage from '../assets/back.jpeg'

const Contact = () => {

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSent(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <PageHead title="Contact Us" backgroundImage={contactImage}/>
      <section className="px-4 py-10 md:px-12 lg:px-32 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#964B00]">Contact Us</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md transition-all duration-300"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="border p-3 rounded-md focus:outline-[#964B00]"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded-md focus:outline-[#964B00]"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="border p-3 rounded-md focus:outline-[#964B00]"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          className="md:col-span-2 border p-3 rounded-md focus:outline-[#964B00]"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-[#964B00] text-white py-3 px-6 rounded-md hover:opacity-90 transition-all duration-300"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        {sent && (
          <p className="text-green-600 md:col-span-2 mt-2 animate-fade-in">
            Message sent successfully!
          </p>
        )}
      </form>
    </section>
    </>
  );
};

export default Contact;




