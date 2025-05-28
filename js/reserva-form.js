        // Pet selection functionality
        document.querySelectorAll('.pet-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.pet-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedPet = document.querySelector('.pet-option.selected');
            if (!selectedPet) {
                alert('Por favor, selecione um pet');
                return;
            }

            const formData = new FormData(this);
            const bookingData = {
                pet: selectedPet.dataset.pet,
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                service: formData.get('service'),
                notes: formData.get('notes')
            };

            console.log('Booking Data:', bookingData);
            alert('Reserva enviada com sucesso! Entraremos em contacto brevemente.');
            
            // Reset form
            this.reset();
            document.querySelectorAll('.pet-option').forEach(opt => opt.classList.remove('selected'));
        });

        // Service details function
        function showServiceDetails() {
            alert('Detalhes do serviço:\n\nBanho & Tosquia Profissional\n- Banho completo com produtos premium\n- Tosquia profissional\n- Corte de unhas\n- Limpeza de ouvidos\n- Escovagem dos dentes\n\nDuração: 2-3 horas\nPreço: €35-50 (dependendo do tamanho do pet)');
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').min = today;
        document.getElementById('endDate').min = today;

        // Update end date minimum when start date changes
        document.getElementById('startDate').addEventListener('change', function() {
            document.getElementById('endDate').min = this.value;
        });

        // Smooth animations on scroll
        window.addEventListener('scroll', function() {
            const elements = document.querySelectorAll('.form-section, .service-details');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });

        // Initialize animations
        document.addEventListener('DOMContentLoaded', function() {
            const elements = document.querySelectorAll('.form-section, .service-details');
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        });