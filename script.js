// Classe para gerenciar o sistema de notas
class GradeSystem {
    constructor() {
        console.log('Sistema iniciado!');
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.init();
    }

    init() {
        console.log('Carregando event listeners...');
        this.loadEventListeners();
        this.renderTable();
        this.updateSummary();
    }

    // Carregar event listeners
    loadEventListeners() {
        const form = document.getElementById('studentForm');
        const clearAllBtn = document.getElementById('clearAll');

        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            console.log('Formulário encontrado!');
        } else {
            console.error('Formulário NÃO encontrado! Verifique o ID.');
        }

        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    // Manipular envio do formulário
    handleFormSubmit(e) {
        e.preventDefault();
        console.log('Formulário enviado!');
        
        const name = document.getElementById('studentName').value.trim();
        const grade1 = parseFloat(document.getElementById('grade1').value);
        const grade2 = parseFloat(document.getElementById('grade2').value);
        const grade3 = parseFloat(document.getElementById('grade3').value;

        console.log('Dados capturados:', { name, grade1, grade2, grade3 });

        // Validação dos campos
        if (!this.validateInputs(name, grade1, grade2, grade3)) {
            return;
        }

        // Calcular média e situação
        const average = this.calculateAverage(grade1, grade2, grade3);
        const status = this.getStatus(average);

        console.log('Média calculada:', average, 'Status:', status);

        // Criar objeto do aluno
        const student = {
            id: Date.now(),
            name: name,
            grade1: grade1,
            grade2: grade2,
            grade3: grade3,
            average: average,
            status: status
        };

        console.log('Aluno criado:', student);

        // Adicionar aluno e atualizar interface
        this.addStudent(student);
        this.clearForm();
        this.renderTable();
        this.updateSummary();
        
        alert('Aluno adicionado com sucesso! Média: ' + average);
    }

    // Validar entradas do usuário
    validateInputs(name, grade1, grade2, grade3) {
        if (!name) {
            alert('Por favor, digite o nome do aluno.');
            return false;
        }

        if (isNaN(grade1) || grade1 < 0 || grade1 > 10) {
            alert('Por favor, digite uma nota 1 válida (0-10).');
            return false;
        }

        if (isNaN(grade2) || grade2 < 0 || grade2 > 10) {
            alert('Por favor, digite uma nota 2 válida (0-10).');
            return false;
        }

        if (isNaN(grade3) || grade3 < 0 || grade3 > 10) {
            alert('Por favor, digite uma nota 3 válida (0-10).');
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
        console.log('Aluno adicionado. Total:', this.students.length);
    }

    // Remover aluno
    removeStudent(id) {
        if (confirm('Tem certeza que deseja remover este aluno?')) {
            this.students = this.students.filter(student => student.id !== id);
            this.saveToLocalStorage();
            this.renderTable();
            this.updateSummary();
            alert('Aluno removido com sucesso!');
        }
    }

    // Limpar todos os dados
    clearAllData() {
        if (this.students.length === 0) {
            alert('Não há dados para limpar.');
            return;
        }

        if (confirm('Tem certeza que deseja remover TODOS os alunos?')) {
            this.students = [];
            this.saveToLocalStorage();
            this.renderTable();
            this.updateSummary();
            alert('Todos os dados foram removidos!');
        }
    }

    // Salvar no localStorage
    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
        console.log('Dados salvos no localStorage:', this.students);
    }

    // Limpar formulário
    clearForm() {
        document.getElementById('studentForm').reset();
    }

    // Renderizar tabela
    renderTable() {
        const tableBody = document.getElementById('tableBody');
        console.log('Renderizando tabela...', this.students);
        
        if (!tableBody) {
            console.error('tableBody NÃO encontrado!');
            return;
        }

        if (this.students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #718096; padding: 40px;">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.grade1}</td>
                <td>${student.grade2}</td>
                <td>${student.grade3}</td>
                <td><strong>${student.average}</strong></td>
                <td>
                    <span class="status-${student.status === 'Aprovado' ? 'approved' : 'failed'}">
                        ${student.status}
                    </span>
                </td>
                <td>
                    <button class="btn-remove" onclick="gradeSystem.removeStudent(${student.id})">
                        Remover
                    </button>
                </td>
            </tr>
        `).join('');

        console.log('Tabela renderizada com sucesso!');
    }

    // Atualizar resumo
    updateSummary() {
        const totalStudents = this.students.length;
        const approvedCount = this.students.filter(student => student.status === 'Aprovado').length;
        const failedCount = totalStudents - approvedCount;

        console.log('Atualizando resumo:', { totalStudents, approvedCount, failedCount });

        const totalElement = document.getElementById('totalStudents');
        const approvedElement = document.getElementById('approvedCount');
        const failedElement = document.getElementById('failedCount');

        if (totalElement) totalElement.textContent = totalStudents;
        if (approvedElement) approvedElement.textContent = approvedCount;
        if (failedElement) failedElement.textContent = failedCount;
    }
}

// Inicializar o sistema
console.log('Script carregado!');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado! Iniciando sistema...');
    window.gradeSystem = new GradeSystem();
});