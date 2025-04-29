import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome to BrainyMath',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        submit: 'Submit',
        create: 'Create'
      },
      auth: {
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        resetPassword: 'Reset Password',
        twoFactor: {
          title: 'Two-Factor Authentication',
          enable: 'Enable 2FA',
          disable: 'Disable 2FA',
          verify: 'Verify Code',
          phoneNumber: 'Phone Number',
          verificationCode: 'Verification Code'
        }
      },
      classroom: {
        title: 'Classroom',
        join: 'Join Class',
        leave: 'Leave Class',
        participants: 'Participants',
        chat: 'Chat',
        whiteboard: 'Whiteboard',
        tools: {
          pen: 'Pen',
          eraser: 'Eraser',
          select: 'Select',
          clear: 'Clear'
        }
      },
      exercises: {
        title: 'Exercises',
        start: 'Start Exercise',
        submit: 'Submit Answer',
        hint: 'Get Hint',
        solution: 'View Solution',
        next: 'Next Exercise',
        answer: 'Your Answer',
        correct: 'Correct!',
        incorrect: 'Incorrect. Try again!',
        correctAnswer: 'Correct Answer'
      },
      teacher: {
        classes: 'My Classes',
        createClass: 'Create Class',
        className: 'Class Name',
        students: 'Students',
        studentProgress: 'Student Progress',
        completedExercises: 'Completed Exercises'
      },
      theme: {
        lightMode: 'Switch to Light Mode',
        darkMode: 'Switch to Dark Mode'
      },
      chat: {
        typeMessage: 'Type a message...',
        send: 'Send'
      }
    }
  },
  fr: {
    translation: {
      common: {
        welcome: 'Bienvenue sur BrainyMath',
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        success: 'Succès!',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        submit: 'Soumettre',
        create: 'Créer'
      },
      auth: {
        login: 'Connexion',
        signup: 'Inscription',
        logout: 'Déconnexion',
        email: 'Email',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        resetPassword: 'Réinitialiser le mot de passe',
        twoFactor: {
          title: 'Authentification à deux facteurs',
          enable: 'Activer 2FA',
          disable: 'Désactiver 2FA',
          verify: 'Vérifier le code',
          phoneNumber: 'Numéro de téléphone',
          verificationCode: 'Code de vérification'
        }
      },
      classroom: {
        title: 'Salle de classe',
        join: 'Rejoindre la classe',
        leave: 'Quitter la classe',
        participants: 'Participants',
        chat: 'Chat',
        whiteboard: 'Tableau blanc',
        tools: {
          pen: 'Stylo',
          eraser: 'Gomme',
          select: 'Sélectionner',
          clear: 'Effacer'
        }
      },
      exercises: {
        title: 'Exercices',
        start: 'Commencer l\'exercice',
        submit: 'Soumettre la réponse',
        hint: 'Obtenir un indice',
        solution: 'Voir la solution',
        next: 'Exercice suivant',
        answer: 'Votre réponse',
        correct: 'Correct!',
        incorrect: 'Incorrect. Essayez encore!',
        correctAnswer: 'Réponse correcte'
      },
      teacher: {
        classes: 'Mes classes',
        createClass: 'Créer une classe',
        className: 'Nom de la classe',
        students: 'Étudiants',
        studentProgress: 'Progrès des étudiants',
        completedExercises: 'Exercices complétés'
      },
      theme: {
        lightMode: 'Passer en mode clair',
        darkMode: 'Passer en mode sombre'
      },
      chat: {
        typeMessage: 'Écrivez un message...',
        send: 'Envoyer'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 