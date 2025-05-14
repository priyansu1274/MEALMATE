document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('culinaryJourneyForm');
    const steps = document.querySelectorAll('.journey-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const whatsappSubmitContainer = document.getElementById('whatsappSubmitContainer');

    let currentStep = 0;

    // Validation functions for each step
    const validatePersonalDetails = () => {
        const fullName = document.getElementById('fullName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const emailAddress = document.getElementById('emailAddress').value.trim();

        if (!fullName || !phoneNumber || !emailAddress) {
            alert('Please fill in all personal details.');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    };

    const validateMealProvider = () => {
        const selectedProvider = document.querySelector('input[name="mealProvider"]:checked');
        if (!selectedProvider) {
            alert('Please select a meal provider.');
            return false;
        }
        return true;
    };

    const validateSubscriptionPlan = () => {
        const selectedPlan = document.querySelector('input[name="subscriptionPlan"]:checked');
        if (!selectedPlan) {
            alert('Please select a subscription plan.');
            return false;
        }
        return true;
    };

    const validateDeliveryDetails = () => {
        const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
        const city = document.getElementById('city').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        if (!deliveryAddress || !city || !postalCode) {
            alert('Please fill in all delivery details.');
            return false;
        }
        return true;
    };

    const validatePayment = () => {
        const paymentConfirmation = document.getElementById('paymentConfirmation');
        if (!paymentConfirmation.checked) {
            alert('Please confirm payment instructions.');
            return false;
        }
        return true;
    };

    const validationSteps = [
        validatePersonalDetails,
        validateMealProvider,
        validateSubscriptionPlan,
        validateDeliveryDetails,
        validatePayment
    ];

    // Update UI for current step
    const updateStep = (stepIndex) => {
        // Hide all steps
        steps.forEach(step => step.style.display = 'none');
        // Show current step
        steps[stepIndex].style.display = 'block';

        // Update progress indicators
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= stepIndex);
        });

        // Toggle previous button visibility
        prevBtn.style.display = stepIndex > 0 ? 'block' : 'none';

        // Toggle next/submit button
        if (stepIndex === steps.length - 1) {
            nextBtn.style.display = 'none';
            whatsappSubmitContainer.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            whatsappSubmitContainer.style.display = 'none';
        }
    };

    // Next step handler
    nextBtn.addEventListener('click', () => {
        // Validate current step before proceeding
        if (validationSteps[currentStep]()) {
            currentStep++;
            if (currentStep < steps.length) {
                updateStep(currentStep);
            }
        }
    });

    // Previous step handler
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStep(currentStep);
        }
    });

    // WhatsApp Submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            emailAddress: document.getElementById('emailAddress').value,
            mealProvider: document.querySelector('input[name="mealProvider"]:checked').value,
            subscriptionPlan: document.querySelector('input[name="subscriptionPlan"]:checked').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            specialInstructions: document.getElementById('specialInstructions').value || 'None'
        };

        // Construct WhatsApp message
        const whatsappMessage = `
*New Meal Subscription Order*

📋 Personal Details:
Name: ${formData.fullName}
Phone: ${formData.phoneNumber}
Email: ${formData.emailAddress}

🍽️ Meal Provider: ${formData.mealProvider}
📅 Subscription Plan: ${formData.subscriptionPlan}

📍 Delivery Details:
Address: ${formData.deliveryAddress}
City: ${formData.city}
Postal Code: ${formData.postalCode}

📝 Special Instructions: ${formData.specialInstructions}
        `.trim();

        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const phoneNumber = '7609952193'; // Replace with your WhatsApp number

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    });

    // Ensure Provider Modal Works
    if (typeof bootstrap !== 'undefined') {
        // Debug: Log all provider cards
        const providerCards = document.querySelectorAll('.provider-card');
        console.log(`Total Provider Cards: ${providerCards.length}`);
        
        providerCards.forEach((card, index) => {
            const provider = card.getAttribute('data-provider');
            console.log(`Card ${index + 1} Provider: ${provider}`);
            
            // If provider is not in details, log error
            if (!providerDetails[provider]) {
                console.error(`No details found for provider: ${provider}`);
                card.style.opacity = '0.5';  // Visually indicate problematic card
                return;
            }

            card.addEventListener('click', function() {
                const details = providerDetails[provider];

                if (!details) {
                    console.error(`Provider details not found for: ${provider}`);
                    return;
                }

                const modalHtml = `
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${details.name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img src="${details.fullImage}" class="img-fluid mb-3" alt="${details.name}">
                                        <p>${details.description}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Meal Plans</h6>
                                        ${details.plans.map(plan => `
                                            <div class="card mb-2">
                                                <div class="card-body">
                                                    <h5 class="card-title">${plan.name}</h5>
                                                    <p class="card-text">${plan.details}</p>
                                                    <span class="badge bg-primary">${plan.price}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const providerModal = document.getElementById('providerModal');
                if (!providerModal) {
                    console.error('Provider modal element not found!');
                    return;
                }
                
                providerModal.innerHTML = modalHtml;
                new bootstrap.Modal(providerModal).show();
            });
        });
    } else {
        console.error('Bootstrap not loaded. Provider modals will not work.');
    }

    const providerDetails = {
        healthybites: {
            name: 'Hotel Gayatri',
            fullImage: '1.png',
            description: 'Crafting nutritious meals that balance flavor and wellness.',
            plans: [
                { name: 'Weekly Plan', price: '₹499', details: 'Perfect for individuals' },
                { name: 'Monthly Plan', price: '₹1799', details: 'Best value for regular eaters' },
                { name: '15-Day Plan', price: '₹999', details: 'Flexible mid-term option' }
            ],
            vegMenu: {
                url: 'healthybites-veg-menu.pdf',
                description: 'Plant-based nutritional meals'
            },
            nonVegMenu: {
                url: 'healthybites-non-veg-menu.pdf',
                description: 'Protein-rich balanced meals'
            }
        },
        nutricraft: {
            name: 'Nutricraft Kitchen',
            fullImage: '2.png',
            description: 'Precision-engineered meals for optimal nutrition.',
            plans: [
                { name: 'Weekly Plan', price: '₹549', details: 'Starter nutrition package' },
                { name: 'Monthly Plan', price: '₹1999', details: 'Comprehensive health plan' },
                { name: '15-Day Plan', price: '₹1099', details: 'Balanced nutrition boost' }
            ],
            vegMenu: {
                url: 'nutricraft-veg-menu.pdf',
                description: 'Vegetarian wellness meals'
            },
            nonVegMenu: {
                url: 'nutricraft-non-veg-menu.pdf',
                description: 'High-protein performance meals'
            }
        },
        mealmaster: {
            name: 'Meal Master',
            fullImage: '3.png',
            description: 'Customized meal solutions for every lifestyle.',
            plans: [
                { name: 'Weekly Plan', price: '₹479', details: 'Quick nutrition fix' },
                { name: 'Monthly Plan', price: '₹1699', details: 'Long-term health commitment' },
                { name: '15-Day Plan', price: '₹899', details: 'Flexible nutrition plan' }
            ],
            vegMenu: {
                url: 'mealmaster-veg-menu.pdf',
                description: 'Plant-powered meal selections'
            },
            nonVegMenu: {
                url: 'mealmaster-non-veg-menu.pdf',
                description: 'Protein-packed meal varieties'
            }
        },
        fitfeast: {
            name: 'Fit Feast',
            fullImage: '4.png',
            description: 'Transforming fitness through intelligent nutrition.',
            plans: [
                { name: 'Weekly Plan', price: '₹529', details: 'Fitness enthusiast package' },
                { name: 'Monthly Plan', price: '₹1899', details: 'Athletic performance plan' },
                { name: '15-Day Plan', price: '₹1049', details: 'Muscle recovery nutrition' }
            ],
            vegMenu: {
                url: 'fitfeast-veg-menu.pdf',
                description: 'Plant-based performance meals'
            },
            nonVegMenu: {
                url: 'fitfeast-non-veg-menu.pdf',
                description: 'Protein-rich athlete meals'
            }
        },
        wellnesswave: {
            name: 'Wellness Wave',
            fullImage: '5.png',
            description: 'Holistic nutrition for mind and body harmony.',
            plans: [
                { name: 'Weekly Plan', price: '₹499', details: 'Wellness starter' },
                { name: 'Monthly Plan', price: '₹1749', details: 'Comprehensive wellness journey' },
                { name: '15-Day Plan', price: '₹949', details: 'Balanced lifestyle boost' }
            ],
            vegMenu: {
                url: 'wellnesswave-veg-menu.pdf',
                description: 'Mindful vegetarian cuisine'
            },
            nonVegMenu: {
                url: 'wellnesswave-non-veg-menu.pdf',
                description: 'Balanced protein nutrition'
            }
        },
        culinaryhealthhub: {
            name: 'Culinary Health Hub',
            fullImage: '6.png',
            description: 'Gourmet meals meeting nutritional excellence.',
            plans: [
                { name: 'Weekly Plan', price: '₹569', details: 'Culinary wellness experience' },
                { name: 'Monthly Plan', price: '₹2049', details: 'Gastronomic health journey' },
                { name: '15-Day Plan', price: '₹1149', details: 'Epicurean nutrition plan' }
            ],
            vegMenu: {
                url: 'culinaryhealthhub-veg-menu.pdf',
                description: 'Artisan vegetarian creations'
            },
            nonVegMenu: {
                url: 'culinaryhealthhub-non-veg-menu.pdf',
                description: 'Gourmet protein selections'
            }
        },
        nutritionalchemy: {
            name: 'Nutrition Alchemy',
            fullImage: '7.png',
            description: 'Transforming ingredients into nutritional gold.',
            plans: [
                { name: 'Weekly Plan', price: '₹509', details: 'Nutritional transformation' },
                { name: 'Monthly Plan', price: '₹1849', details: 'Comprehensive health metamorphosis' },
                { name: '15-Day Plan', price: '₹1049', details: 'Wellness breakthrough' }
            ],
            vegMenu: {
                url: 'nutritionalchemy-veg-menu.pdf',
                description: 'Plant-based nutritional magic'
            },
            nonVegMenu: {
                url: 'nutritionalchemy-non-veg-menu.pdf',
                description: 'Protein-powered performance'
            }
        },
        vitalvibe: {
            name: 'Vital Vibe',
            fullImage: '8.png',
            description: 'Energizing meals that fuel your potential.',
            plans: [
                { name: 'Weekly Plan', price: '₹489', details: 'Energy boost package' },
                { name: 'Monthly Plan', price: '₹1749', details: 'Sustained vitality plan' },
                { name: '15-Day Plan', price: '₹899', details: 'Quick energy reset' }
            ],
            vegMenu: {
                url: 'vitalvibe-veg-menu.pdf',
                description: 'Vibrant vegetarian vitality'
            },
            nonVegMenu: {
                url: 'vitalvibe-non-veg-menu.pdf',
                description: 'Protein-charged performance meals'
            }
        },
        nourishnetwork: {
            name: 'Nourish Network',
            fullImage: '9.png',
            description: 'Connected nutrition for modern lifestyles.',
            plans: [
                { name: 'Weekly Plan', price: '₹539', details: 'Lifestyle nutrition' },
                { name: 'Monthly Plan', price: '₹1949', details: 'Comprehensive wellness connection' },
                { name: '15-Day Plan', price: '₹1099', details: 'Adaptive nutrition plan' }
            ],
            vegMenu: {
                url: 'nourishnetwork-veg-menu.pdf',
                description: 'Plant-powered lifestyle meals'
            },
            nonVegMenu: {
                url: 'nourishnetwork-non-veg-menu.pdf',
                description: 'Protein-rich life fuel'
            }
        },
        smartmeal: {
            name: 'Smart Meal',
            fullImage: '10.png',
            description: 'Intelligent nutrition tailored to your needs.',
            plans: [
                { name: 'Weekly Plan', price: '₹519', details: 'Smart nutrition start' },
                { name: 'Monthly Plan', price: '₹1899', details: 'Comprehensive smart eating' },
                { name: '15-Day Plan', price: '₹1049', details: 'Precision nutrition' }
            ],
            vegMenu: {
                url: 'smartmeal-veg-menu.pdf',
                description: 'Intelligent vegetarian choices'
            },
            nonVegMenu: {
                url: 'smartmeal-non-veg-menu.pdf',
                description: 'Smart protein strategies'
            }
        },
        wellnesswagon: {
            name: 'Wellness Wagon',
            fullImage: '11.png',
            description: 'Delivering wellness to your doorstep.',
            plans: [
                { name: 'Weekly Plan', price: '₹459', details: 'Wellness journey start' },
                { name: 'Monthly Plan', price: '₹1649', details: 'Comprehensive health delivery' },
                { name: '15-Day Plan', price: '₹849', details: 'Mobility meets nutrition' }
            ],
            vegMenu: {
                url: 'wellnesswagon-veg-menu.pdf',
                description: 'Mobile vegetarian wellness'
            },
            nonVegMenu: {
                url: 'wellnesswagon-non-veg-menu.pdf',
                description: 'Protein-powered mobility'
            }
        },
        nutritionpulse: {
            name: 'Nutrition Pulse',
            fullImage: '12.png',
            description: 'Measuring and maximizing your nutritional potential.',
            plans: [
                { name: 'Weekly Plan', price: '₹499', details: 'Nutritional baseline' },
                { name: 'Monthly Plan', price: '₹1799', details: 'Comprehensive health metrics' },
                { name: '15-Day Plan', price: '₹999', details: 'Performance nutrition' }
            ],
            vegMenu: {
                url: 'nutritionpulse-veg-menu.pdf',
                description: 'Vegetarian vitality metrics'
            },
            nonVegMenu: {
                url: 'nutritionpulse-non-veg-menu.pdf',
                description: 'Protein performance tracking'
            }
        },
        foodfusion: {
            name: 'Food Fusion',
            fullImage: '13.png',
            description: 'Blending cuisines, cultures, and nutritional science.',
            plans: [
                { name: 'Weekly Plan', price: '₹549', details: 'Culinary exploration' },
                { name: 'Monthly Plan', price: '₹1999', details: 'Global nutrition journey' },
                { name: '15-Day Plan', price: '₹1149', details: 'Taste meets nutrition' }
            ],
            vegMenu: {
                url: 'foodfusion-veg-menu.pdf',
                description: 'Vegetarian world tour'
            },
            nonVegMenu: {
                url: 'foodfusion-non-veg-menu.pdf',
                description: 'International protein palette'
            }
        },
        mindfulmeals: {
            name: 'Mindful Meals',
            fullImage: '14.png',
            description: 'Conscious eating for holistic well-being.',
            plans: [
                { name: 'Weekly Plan', price: '₹479', details: 'Mindful nutrition start' },
                { name: 'Monthly Plan', price: '₹1699', details: 'Comprehensive conscious eating' },
                { name: '15-Day Plan', price: '₹899', details: 'Awareness-driven nutrition' }
            ],
            vegMenu: {
                url: 'mindfulmeals-veg-menu.pdf',
                description: 'Conscious vegetarian choices'
            },
            nonVegMenu: {
                url: 'mindfulmeals-non-veg-menu.pdf',
                description: 'Mindful protein strategies'
            }
        },
        nutritionnavigator: {
            name: 'Nutrition Navigator',
            fullImage: '15.png',
            description: 'Guiding you through your personalized nutrition journey.',
            plans: [
                { name: 'Weekly Plan', price: '₹529', details: 'Nutrition exploration' },
                { name: 'Monthly Plan', price: '₹1899', details: 'Comprehensive health guidance' },
                { name: '15-Day Plan', price: '₹1049', details: 'Directed wellness path' }
            ],
            vegMenu: {
                url: 'nutritionnavigator-veg-menu.pdf',
                description: 'Vegetarian navigation'
            },
            nonVegMenu: {
                url: 'nutritionnavigator-non-veg-menu.pdf',
                description: 'Protein-powered direction'
            }
        }
    };

    // Initialize first step
    updateStep(currentStep);
});