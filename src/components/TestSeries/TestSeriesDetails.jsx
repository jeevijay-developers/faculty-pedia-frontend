import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import { testSeriesData, calculateValidity, formatCurrency } from '@/Data/TestSeries/testseries.data';
import { formatDate } from '@/utils/dateFormatter';

const TestSeriesDetails = ({ testSeriesId, examType = 'neet' }) => {
  // Find the test series by ID from our data
  const testSeriesItem = testSeriesData.find(item => item._id === testSeriesId);
  
  // If test series not found, use mock data (for development only)
  const testSeries = testSeriesItem || {
    _id: testSeriesId,
    title: 'Complete Physics Test Series 2024',
    image: {
      url: '/images/placeholders/1.svg'
    },
    noOfTests: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    price: 4999,
    discountPrice: 2999,
    discount: 40,
    description: `This comprehensive test series is designed to help NEET aspirants master Physics concepts through regular practice and assessment. The series includes chapter-wise tests, subject tests, and full-length mock exams that simulate the actual NEET examination pattern.

    Our test series is prepared by experienced faculty members who have in-depth knowledge of the NEET syllabus and exam pattern. Each test is followed by detailed solutions and performance analysis to help you identify your strengths and areas for improvement.
    
    Regular practice with our test series will help you build speed, accuracy, and confidence for the actual NEET examination.`,
    syllabus: [
      {
        title: 'Mechanics',
        topics: [
          'Units and Measurement',
          'Motion in a Straight Line',
          'Motion in a Plane',
          'Laws of Motion',
          'Work, Energy and Power',
          'System of Particles and Rotational Motion',
          'Gravitation'
        ]
      },
      {
        title: 'Thermodynamics',
        topics: [
          'Thermal Properties of Matter',
          'Thermodynamics',
          'Kinetic Theory'
        ]
      },
      {
        title: 'Electrodynamics',
        topics: [
          'Electric Charges and Fields',
          'Electrostatic Potential and Capacitance',
          'Current Electricity',
          'Moving Charges and Magnetism',
          'Magnetism and Matter',
          'Electromagnetic Induction',
          'Alternating Current'
        ]
      },
      {
        title: 'Optics and Modern Physics',
        topics: [
          'Ray Optics and Optical Instruments',
          'Wave Optics',
          'Dual Nature of Radiation and Matter',
          'Atoms',
          'Nuclei',
          'Semiconductor Electronics'
        ]
      }
    ],
    faqs: [
      {
        question: 'How can I access the test series?',
        answer: 'Once enrolled, you can access the test series through our web portal or mobile app. You\'ll receive login credentials via email immediately after payment.'
      },
      {
        question: 'Is there a time limit for each test?',
        answer: 'Yes, each test has a specific time limit that matches the NEET exam pattern - 180 minutes for full-length tests and appropriate durations for chapter and subject tests.'
      },
      {
        question: 'Will I get performance analytics?',
        answer: 'Yes, detailed performance analytics are provided after each test, including topic-wise strengths and weaknesses, comparison with other students, and improvement areas.'
      },
      {
        question: 'Can I attempt a test multiple times?',
        answer: 'Yes, you can attempt each test up to 3 times to improve your performance and understanding.'
      },
      {
        question: 'Is there any support available if I have doubts?',
        answer: 'Yes, we have a dedicated doubt-solving platform where our faculty will address your queries within 24 hours.'
      }
    ],
    teacher: {
      name: 'Dr. Rajesh Sharma',
      image: '/images/placeholders/1.svg',
      qualification: 'PhD in Physics, IIT Delhi',
      experience: '15+ years teaching NEET Physics',
      about: 'Dr. Rajesh Sharma is a renowned Physics educator with extensive experience in preparing students for NEET and other competitive exams. His teaching methodology focuses on conceptual clarity and problem-solving techniques.'
    },
    relatedTestSeries: [
      {
        id: 'neet_chemistry_001',
        title: 'Complete NEET Chemistry Test Series 2024',
        image: '/images/placeholders/1.svg',
        tests: 25,
        price: 2499
      },
      {
        id: 'neet_biology_001',
        title: 'Complete NEET Biology Test Series 2024',
        image: '/images/placeholders/1.svg',
        tests: 35,
        price: 2999
      },
      {
        id: 'neet_combo_001',
        title: 'NEET Complete Test Series Bundle 2024',
        image: '/images/placeholders/1.svg',
        tests: 90,
        price: 7999
      }
    ],
    reviews: {
      average: 4.8,
      count: 245,
      distribution: [
        { stars: 5, percentage: 85 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 3 },
        { stars: 2, percentage: 1.5 },
        { stars: 1, percentage: 0.5 }
      ],
      testimonials: [
        {
          name: 'Priya Singh',
          rating: 5,
          comment: 'This test series helped me improve my Physics score significantly. The detailed solutions and performance analysis were extremely helpful.',
          date: '15 May 2023'
        },
        {
          name: 'Rahul Verma',
          rating: 4,
          comment: 'Very comprehensive coverage of the syllabus. The difficulty level matches the actual NEET exam which is great for preparation.',
          date: '03 April 2023'
        },
        {
          name: 'Anjali Sharma',
          rating: 5,
          comment: 'Dr. Sharma\'s explanations in the solutions are exceptional. They helped me understand complex concepts more easily.',
          date: '27 March 2023'
        }
      ]
    }
  };

  // Pricing from dataset
  const price = typeof testSeries.price === 'number' ? testSeries.price : 0;

  // No reviews rendering required

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Test Series Banner */}
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src={testSeries.image?.url || '/images/placeholders/1.svg'}
          alt={testSeries.title}
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-75"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {testSeries.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Test Series Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <FaFileAlt className="text-blue-600 text-2xl mr-3" />
              <div>
                <h3 className="text-sm text-gray-500">Number of Tests</h3>
                <p className="font-semibold text-lg">{testSeries.noOfTests ?? testSeries.tests ?? 0} Tests</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <FaClock className="text-blue-600 text-2xl mr-3" />
              <div>
                <h3 className="text-sm text-gray-500">Validity</h3>
                <p className="font-semibold text-lg">
                  {calculateValidity(testSeries.startDate, testSeries.endDate)}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <FaCalendarAlt className="text-blue-600 text-2xl mr-3" />
              <div>
                <h3 className="text-sm text-gray-500">Starting</h3>
                <p className="font-semibold text-lg">{formatDate(testSeries.startDate, 'short')}</p>
              </div>
            </div>
          </div>

          {/* Teacher Profile */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">About the Educator</h2>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={testSeries.teacher?.profileImage || '/images/placeholders/square.svg'}
                  alt={testSeries.teacher?.name || 'Educator'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{testSeries.teacher?.name || 'Experienced Educator'}</h3>
                <p className="text-gray-600">{testSeries.teacher?.qualification || 'Qualified Professional'}</p>
                <p className="text-gray-600 mb-2">{testSeries.teacher?.experience || 'Expert in the subject'}</p>
                <p className="text-gray-700">
                  {testSeries.teacher?.about || 'An experienced educator dedicated to helping students excel in their exams through quality test preparation and guidance.'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 text-center w-1/3 ${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 text-center w-1/3 ${
                  activeTab === 'syllabus'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('syllabus')}
              >
                Syllabus
              </button>
              <button
                className={`px-6 py-3 text-center w-1/3 ${
                  activeTab === 'faqs'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="whitespace-pre-line">{testSeries.description?.long || testSeries.description?.short || 'No description available.'}</div>
              )}
              {activeTab === 'syllabus' && (
                <div>
                  {testSeries.syllabus ? (
                    testSeries.syllabus.map((section, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                        <ul className="list-disc pl-5">
                          {section.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="mb-1 text-gray-700">
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Comprehensive Syllabus Coverage</h3>
                      <p className="text-gray-700 mb-4">
                        This test series covers the complete syllabus as per the latest examination pattern. Our tests are designed to help you master all the topics required for the exam.
                      </p>
                      <p className="text-gray-700">
                        The test series includes chapter-wise tests, subject tests, and full-length mock exams to provide comprehensive practice.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'faqs' && (
                <div className="divide-y">
                  {testSeries.faqs ? (
                    testSeries.faqs.map((faq, index) => (
                      <div key={index} className="py-4">
                        <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="py-4">
                        <h3 className="text-lg font-medium mb-2">How can I access the test series?</h3>
                        <p className="text-gray-700">Once enrolled, you can access the test series through our web portal or mobile app. You'll receive login credentials via email immediately after payment.</p>
                      </div>
                      <div className="py-4">
                        <h3 className="text-lg font-medium mb-2">What is the validity period of this test series?</h3>
                        <p className="text-gray-700">This test series is valid from {formatDate(testSeries.startDate)} to {formatDate(testSeries.endDate)}.</p>
                      </div>
                      <div className="py-4">
                        <h3 className="text-lg font-medium mb-2">Will I get detailed solutions for the tests?</h3>
                        <p className="text-gray-700">Yes, detailed solutions are provided for all questions along with explanations to help you understand the concepts better.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-6">Student Reviews</h2>
            
            {testSeries.reviews ? (
              <>
                <div className="flex flex-col md:flex-row mb-8">
                  <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {testSeries.reviews.average}
                    </div>
                    <div className="flex my-2">
                      {renderStars(testSeries.reviews.average)}
                    </div>
                    <p className="text-gray-600">
                      Based on {testSeries.reviews.count} reviews
                    </p>
                  </div>
                  
                  <div className="md:w-2/3">
                    {testSeries.reviews.distribution.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="w-12 text-sm flex items-center">
                          {item.stars} <FaStar className="ml-1 text-yellow-500" />
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mx-2">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-10 text-sm text-gray-600">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divide-y">
                  {testSeries.reviews.testimonials.map((review, index) => (
                    <div key={index} className="py-6">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                          <FaUser />
                        </div>
                        <div>
                          <h3 className="font-medium">{review.name}</h3>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex my-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl font-bold text-blue-600 mb-2">4.9</div>
                <div className="flex justify-center my-2">
                  {renderStars(4.9)}
                </div>
                <p className="text-gray-600 mb-8">
                  Based on student feedback
                </p>
                
                <div className="divide-y max-w-2xl mx-auto">
                  <div className="py-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                        <FaUser />
                      </div>
                      <div>
                        <h3 className="font-medium">Ravi Kumar</h3>
                        <p className="text-sm text-gray-500">2 months ago</p>
                      </div>
                    </div>
                    <div className="flex my-2">
                      {renderStars(5)}
                    </div>
                    <p className="text-gray-700 mt-2">
                      "This test series was extremely helpful for my exam preparation. The questions were challenging and matched the actual exam pattern."
                    </p>
                  </div>
                  
                  <div className="py-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                        <FaUser />
                      </div>
                      <div>
                        <h3 className="font-medium">Priya Sharma</h3>
                        <p className="text-sm text-gray-500">1 month ago</p>
                      </div>
                    </div>
                    <div className="flex my-2">
                      {renderStars(5)}
                    </div>
                    <p className="text-gray-700 mt-2">
                      "The detailed solutions provided after each test helped me understand my mistakes and improve my concepts. Highly recommended!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Price Card */}
          <div className="bg-white p-6 rounded-lg shadow mb-8 sticky top-20">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(effectivePrice)}
              </span>
              {originalPrice && discountedPrice && originalPrice > discountedPrice && (
                <span className="text-xl text-gray-500 line-through ml-3">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  {discountPercent}% off
                </span>
              )}
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mb-4 hover:bg-blue-700 transition">
              Enroll Now
            </button>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{testSeries.noOfTests ?? testSeries.tests ?? 0} online tests</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Detailed solutions</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Performance analytics</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Access on all devices</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Doubt solving support</span>
              </li>
            </ul>
          </div>

          {/* Related Test Series */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Related Test Series</h2>
            <div className="space-y-4">
              {relatedItems.length ? (
                relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/exams/${examType}/test-series/${item.id}`}
                    className="block"
                  >
                    <div className="flex gap-3 hover:bg-gray-50 p-2 rounded transition">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.tests} Tests</p>
                        <p className="text-sm font-medium text-blue-600">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-600">No related test series available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesDetails;
