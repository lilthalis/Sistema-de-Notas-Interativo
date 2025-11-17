// Classe para gerenciar o sistema de notas
class GradeSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.init();
    }

    init() {
        this.loadEventListeners();
        this.renderTable();
        this.updateSummary();
    }

    // Carregar event listeners
    loadEventListeners() {
        const form = document.getElementById('studentForm');
        const clearAllBtn = document.getElementById('clearAll');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        clearAllBtn.addEventListener('click', () => this.clearAllData());
    }

    // Manipular envio do formulário
    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('studentName').value.trim();
        const grade1 = parseFloat(document.getElementById('grade1').value);
        const grade2 = parseFloat(document.getElementById('grade2').value);
        const grade3 = parseFloat(document.getElementById('grade3').value);

        // Validação dos campos
        if (!this.validateInputs(name, grade1, grade2, grade3)) {
            return;
        }

        // Calcular média e situação
        const average = this.calculateAverage(grade1, grade2, grade3);
        const status = this.getStatus(average);

        // Criar objeto do aluno
        const student = {
            id: Date.now(), // ID único baseado no timestamp
            name: name,
            grade1: grade1,
            grade2: grade2,
            grade3: grade3,
            average: average,
            status: status
        };

        // Adicionar aluno e atualizar interface
        this.addStudent(student);
        this.clearForm();
        this.renderTable();
        this.updateSummary();
        
        // Feedback visual
        this.showSuccessMessage('Aluno adicionado com sucesso!');
    }

    // Validar entradas do usuário
    validateInputs(name, grade1, grade2, grade3) {
        if (!name) {
            this.showErrorMessage('Por favor, digite o nome do aluno.');
            return false;
        }

        if (isNaN(grade1) || grade1 < 0 || grade1 > 10) {
            this.showErrorMessage('Por favor, digite uma nota 1 válida (0-10).');
            return false;
        }

        if (isNaN(grade2) || grade2 < 0 || grade2 > 10) {
            this.showErrorMessage('Por favor, digite uma nota 2 válida (0-10).');
            return false;
        }

        if (isNaN(grade3) || grade3 < 0 || grade3 > 10) {
            this.showErrorMessage('Por favor, digite uma nota 3 válida (0-10).');
            return false;
        }

        return true;
    }

    // Calcular média com 3 notas
    calculateAverage(grade1, grade2, grade3) {
        return ((grade1 + grade2 + grade3) / 3).toFixed(1);
    }

    // Determinar situação do aluno
    getStatus(average) {
        return average >= 6 ? 'Aprovado' : 'Reprovado';
    }

    // Adicionar aluno à lista
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }

    // Remover aluno
    removeStudent(id) {
        if (confirm('Tem certeza que deseja remover este aluno?')) {
            this.students = this.students.filter(student => student.id !== id);
            this.saveToLocalStorage();
            this.renderTable();
            this.updateSummary();
            this.showInfoMessage('Aluno removido com sucesso!');
        }
    }

    // Limpar todos os dados
    clearAllData() {
        if (this.students.length === 0) {
            this.showInfoMessage('Não há dados para limpar.');
            return;
        }

        if (confirm('Tem certeza que deseja remover TODOS os alunos? Esta ação não pode ser desfeita.')) {
            this.students = [];
            this.saveToLocalStorage();
            this.renderTable();
            this.updateSummary();
            this.showSuccessMessage('Todos os dados foram removidos com sucesso!');
        }
    }

    // Salvar no localStorage
    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    // Limpar formulário
    clearForm() {
        document.getElementById('studentForm').reset();
    }

    // Renderizar tabela com ícones
    renderTable() {
        const tableBody = document.getElementById('tableBody');
        
        if (this.students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #718096; padding: 40px;">
                        <i class="fas fa-users" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 10px; display: block;"></i>
                        Nenhum aluno cadastrado. <br>Adicione o primeiro aluno usando o formulário acima.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.students.map(student => `
            <tr>
                <td><i class="fas fa-user-graduate"></i> ${student.name}</td>
                <td>${student.grade1}</td>
                <td>${student.grade2}</td>
                <td>${student.grade3}</td>
                <td><strong><i class="fas fa-calculator"></i> ${student.average}</strong></td>
                <td>
                    <span class="status-${student.status === 'Aprovado' ? 'approved' : 'failed'}">
                        ${student.status === 'Aprovado' ? 
                          '<i class="fas fa-check-circle"></i> Aprovado' : 
                          '<i class="fas fa-times-circle"></i> Reprovado'}
                    </span>
                </td>
                <td>
                    <button class="btn-remove" onclick="gradeSystem.removeStudent(${student.id})" title="Remover aluno">
                        <i class="fas fa-trash-alt"></i> Remover
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Atualizar resumo
    updateSummary() {
        const totalStudents = this.students.length;
        const approvedCount = this.students.filter(student => student.status === 'Aprovado').length;
        const failedCount = totalStudents - approvedCount;

        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('approvedCount').textContent = approvedCount;
        document.getElementById('failedCount').textContent = failedCount;
    }

    // Mensagens de feedback
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    showMessage(message, type) {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.alert-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert-message alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
            ${message}
        `;

        // Adiciona estilos inline para a mensagem
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            ${type === 'success' ? 'background: #38a169;' : 
              type === 'error' ? 'background: #e53e3e;' : 
              'background: #3182ce;'}
        `;

        document.body.appendChild(alert);

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.gradeSystem = new GradeSystem();
});

// Adicionar alguns alunos de exemplo (opcional - para teste)
function addSampleData() {
    const sampleStudents = [
        { name: "Ana Silva", grade1: 8.5, grade2: 7.5, grade3: 9.0 },
        { name: "Carlos Oliveira", grade1: 5.0, grade2: 6.0, grade3: 4.5 },
        { name: "Mariana Santos", grade1: 9.0, grade2: 8.5, grade3: 7.5 },
        { name: "João Pereira", grade1: 7.0, grade2: 6.5, grade3: 8.0 }
    ];

    sampleStudents.forEach(student => {
        const average = ((student.grade1 + student.grade2 + student.grade3) / 3).toFixed(1);
        const status = average >= 6 ? 'Aprovado' : 'Reprovado';
        
        window.gradeSystem.addStudent({
            id: Date.now() + Math.random(),
            ...student,
            average: average,
            status: status
        });
    });

    window.gradeSystem.renderTable();
    window.gradeSystem.updateSummary();
}

// Descomente a linha abaixo se quiser adicionar dados de exemplo automaticamente
// document.addEventListener('DOMContentLoaded', addSampleData);