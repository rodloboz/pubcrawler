class Pub < ApplicationRecord
  DISTRICTS = [
    "Alcântara",
    "Alfama",
    "Avenida da Liberdade",
    "Avenidas Novas",
    "Bairro Alto",
    "Baixa",
    "Belém",
    "Cais do Sodré",
    "Campo de Ourique",
    "Castelo",
    "Chiado",
    "Mouraria",
    "Parque das Nações",
    "Príncipe Real",
    "Santos"
  ]
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  validates :name, presence: true
end
